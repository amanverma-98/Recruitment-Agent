from fastapi import Depends, HTTPException, status

from jose import jwt, JWTError

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from Backend.app.core.database import get_db
from Backend.app.core.config import settings

from Backend.app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/token"
)


def get_current_user(

    token: str = Depends(oauth2_scheme),

    db: Session = Depends(get_db)

):

    credentials_exception = HTTPException(

        status_code=status.HTTP_401_UNAUTHORIZED,

        detail="Invalid authentication credentials",

        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(

            token,

            settings.SECRET_KEY,

            algorithms=[settings.ALGORITHM]

        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = (

        db.query(User)

        .filter(User.id == user_id)

        .first()

    )

    if user is None:
        raise credentials_exception

    return user