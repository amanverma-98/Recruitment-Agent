from sqlalchemy.orm import Session

from Backend.app.models.user import User
from Backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register_user(db: Session, name: str, email: str, password: str):

    existing = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing:
        raise ValueError("Email already registered")

    user = User(
        name=name,
        email=email,
        password=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(db: Session, email: str, password: str):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user.password):
        raise ValueError("Invalid email or password")

    token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    return token