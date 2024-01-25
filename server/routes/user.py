from datetime import datetime
from flask import Blueprint,request,make_response,jsonify
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse,abort
from flask_jwt_extended import jwt_required,get_jwt_identity,current_user
from flask_bcrypt import Bcrypt
from serializer import user_schema
from models import db,User,BlogPost,Comment,Category,Media,blogs_categories

user_bp=Blueprint('user_blueprint',__name__)
ma=Marshmallow(user_bp)
api=Api(user_bp)
bcrypt = Bcrypt()

update_user_parser=reqparse.RequestParser()
update_user_parser.add_argument('firstname',type=str)
update_user_parser.add_argument('lastname',type=str)
update_user_parser.add_argument('email',type=str)
update_user_parser.add_argument('profile_image',type=str)


change_password_args=reqparse.RequestParser()
change_password_args.add_argument('currentPassword',type=str, required=True)
change_password_args.add_argument('newPassword',type=str, required=True)
change_password_args.add_argument('confirmPassword',type=str, required=True)



class UserById(Resource):

    @jwt_required()
    def patch(self, id):
        data = update_user_parser.parse_args()
        user = User.query.filter_by(id=id).first()
        
        if not user:
            response_body = {"error": "user not found"}
            return make_response(response_body, 404)
        else:
            user_id = get_jwt_identity()
            
         
            profile_image = data.get("profile_image")
            
        
            user.profile_image = profile_image
            user.firstname = data["firstname"]
            user.lastname = data["lastname"]
            user.email = data["email"]

            db.session.commit()
            result = user_schema.dump(user)
            return make_response(jsonify(result), 201)


api.add_resource(UserById, "/users/<int:id>")

class ChangePassword(Resource):
    @jwt_required()
    def post(self):
        data = change_password_args.parse_args()

        user_id = get_jwt_identity()
        current_user = User.query.get(user_id)

        if current_user:
          
            if not bcrypt.check_password_hash(current_user.password, data["currentPassword"]):
                return abort(401, detail="Incorrect current password")

           
            if data["newPassword"] != data["confirmPassword"]:
                return abort(422, detail="New password and confirm password do not match")

            hashed_password = bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')
            current_user.password = hashed_password

            db.session.commit()

            return {'detail': 'Password has been changed successfully'}
        else:
            return abort(404, detail='User not found')

api.add_resource(ChangePassword, '/change_password')

