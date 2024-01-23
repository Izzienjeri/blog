from datetime import datetime
from flask import Blueprint,request,make_response,jsonify
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse,abort
from flask_jwt_extended import jwt_required,get_jwt_identity,current_user
from serializer import comment_schema
from models import db,User,BlogPost,Comment,Category,Media,blogs_categories

comment_bp=Blueprint('comments_blueprint',__name__)
ma=Marshmallow(comment_bp)
api=Api(comment_bp)



add_comment_parser=reqparse.RequestParser()
add_comment_parser.add_argument('content',type=str,required=True, help='Comment cannot be blank')
add_comment_parser.add_argument('guest_name',type=str,required=True, help='Guest Name cannot be blank')
add_comment_parser.add_argument('post_id',type=str,required=True)


update_comment_parser=reqparse.RequestParser()
update_comment_parser.add_argument('content',type=str)


class Comments(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity() 
        data = add_comment_parser.parse_args()
        

       
        if current_user_id:
           
            current_user = User.query.get(current_user_id)
            guest_name = current_user.username if current_user else None

            new_comment = Comment(
                content=data["content"],
                user_id=current_user_id,
                guest_name=guest_name,
                is_guest=False, 
                post_id=data["post_id"],
                created_at=datetime.utcnow()
            )
        else:
           
            new_comment = Comment(
                content=data["content"],
                user_id=None,
                guest_name=data["guest_name"],
                is_guest=True,
                post_id=data["post_id"],
                created_at=datetime.utcnow()
            )

        db.session.add(new_comment)
        db.session.commit()
        result = comment_schema.dump(new_comment)
        return make_response(jsonify(result), 201)

api.add_resource(Comments, "/comments")


class CommentById(Resource):
    @jwt_required(optional=True)  
    def get(self, id):
        single_comment = Comment.query.filter_by(id=id).first()
        result = comment_schema.dump(single_comment)
        return make_response(jsonify(result), 200)

    @jwt_required()
    def patch(self, id):
        data = update_comment_parser.parse_args()
        current_user_id = get_jwt_identity()  

        
        single_comment = Comment.query.filter_by(id=id).first()
        if not single_comment:
            response_body = {"error": "Comment not found"}
            return make_response(response_body, 404)

        if current_user_id and single_comment.user_id == current_user_id:
            single_comment.content = data["content"]
            result = comment_schema.dump(single_comment)
            db.session.commit()
            return make_response(jsonify(result), 201)

        response_body = {"message": "401: Not Authorized"}
        return make_response(response_body, 401)

    @jwt_required()  
    def delete(self, id):
        current_user_id = get_jwt_identity()  
      
        single_comment = Comment.query.filter_by(id=id).first()
        if not single_comment:
            response_body = {"error": "Comment not found"}
            return make_response(response_body, 404)

        if current_user_id and single_comment.user_id == current_user_id:
            db.session.delete(single_comment)
            db.session.commit()
            response_body = {"message": "Comment successfully deleted"}
            return make_response(jsonify(response_body), 204)

        response_body = {"message": "401: Not Authorized"}
        return make_response(response_body, 401)

api.add_resource(CommentById, "/comments/<int:id>")
