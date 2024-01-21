from flask import Blueprint
from flask_bcrypt import Bcrypt
from flask_jwt_extended import current_user
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_restful import Api, Resource, reqparse, abort
from models import User, db, TokenBlocklist
import datetime

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()
jwt = JWTManager()
api = Api(auth_bp)

register_args = reqparse.RequestParser()
register_args.add_argument("username", type=str, required=True)
register_args.add_argument("email", type=str, required=True)
register_args.add_argument("password", type=str, required=True)
register_args.add_argument("confirmPassword", type=str, required=True)

login_args = reqparse.RequestParser()
login_args.add_argument("username", type=str, required=True)
login_args.add_argument("password", type=str, required=True)

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).first()

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist).filter_by(jti=jti).first()
    return token is not None

class UserLogin(Resource):
   
   
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return abort(404, detail="User not found")
        return {"username": user.username, "user_id": user.id}

    def post(self):
        data = login_args.parse_args()
        user = User.query.filter_by(username=data.username).first()

        if not user:
            return abort(404, detail="User does not exist")

        if not bcrypt.check_password_hash(user.password, data.password):
            return abort(403, detail="Wrong password")

        token = create_access_token(identity=user.id)
        return {"access_token": token, "username": user.username, "user_id":user.id,"email":user.email,"profile_image":user.profile_image}

api.add_resource(UserLogin, "/login")
class UserRegister(Resource):
    def post(self):
        data = register_args.parse_args()
        if data["password"] != data["confirmPassword"]:
            return abort(422, detail="Passwords do not match")
        new_user = User(username=data.username, email=data.email, password=bcrypt.generate_password_hash(data.password).decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()
        return {'detail': f'User {data.username} has been created successfully'}


api.add_resource(UserRegister, "/register")

class UserLogout(Resource):
    @jwt_required()
    def get(self):
        token = get_jwt_identity()
        blocked_token = TokenBlocklist(jti=token['jti'], created_at=datetime.datetime.utcnow())
        db.session.add(blocked_token)
        db.session.commit()
        return {'detail': "Token logged out"}

api.add_resource(UserLogout, "/logout")
