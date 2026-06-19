from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse
)

from app.services.auth_service import (
    register_user,
    login_user
)

from app.core.dependencies import get_current_user

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse
)
def register(

    request: RegisterRequest,

    db: Session = Depends(get_db)

):

    try:

        return register_user(

            db,

            request.name,

            request.email,

            request.password

        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(

    request: LoginRequest,

    db: Session = Depends(get_db)

):

    try:

        token = login_user(

            db,

            request.email,

            request.password

        )

        return {

            "access_token": token

        }

    except ValueError as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@router.get(
    "/me",
    response_model=UserResponse
)
def me(
    current_user=Depends(get_current_user)
):

    return current_user


from fastapi.security import OAuth2PasswordRequestForm


@router.post("/token", response_model=TokenResponse)
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        token = login_user(
            db,
            form_data.username,   # email goes here
            form_data.password
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )