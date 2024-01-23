from datetime import datetime
from flask import Blueprint,request,make_response,jsonify
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse,abort
from flask_jwt_extended import jwt_required,get_jwt_identity,current_user
from sqlalchemy.exc import SQLAlchemyError
from serializer import blog_schema
from models import db,BlogPost,blogs_categories,Category,Comment,Media


blog_bp=Blueprint('blogs_blueprint',__name__)
ma=Marshmallow(blog_bp)
api=Api(blog_bp)




add_post_parser=reqparse.RequestParser()
add_post_parser.add_argument('title', type=str, required=True, help='Title cannot be blank')
add_post_parser.add_argument('content', type=str, required=True, help='Content cannot be blank')
add_post_parser.add_argument('excerpt', type=str, required=True, help='Excerpt cannot be blank')
add_post_parser.add_argument('category', type=str, required=True, help='Excerpt cannot be blank')




update_post_parser = reqparse.RequestParser()
update_post_parser.add_argument('title', type=str)
update_post_parser.add_argument('content', type=str)
update_post_parser.add_argument('excerpt', type=str)
update_post_parser.add_argument('category', type=str)



class Blog(Resource):
    def get(self):
        blogs = BlogPost.query.all()
        result = blog_schema.dump(blogs, many=True)
        return make_response(jsonify(result), 200)
    

    @jwt_required()
    def post(self):
        data = add_post_parser.parse_args()
        title = data["title"]
        content = data["content"]
        excerpt = data["excerpt"]
        categories=data["category"]

        user_id = current_user.id

        new_blog = BlogPost(title=title, content=content, excerpt=excerpt, pub_date=datetime.utcnow(), user_id=user_id)
        db.session.add(new_blog)
        db.session.commit()
        blog_id = new_blog.id
        print(blog_id)
        category = Category.query.filter_by(name=categories).first()
        if category:
            blog_id = new_blog.id
            category_id = category.id
            print(blog_id)
            print(category_id)

            blogs_categories_data = {'blog_id': blog_id, 'category_id': category_id}
            db.session.execute(blogs_categories.insert().values(blogs_categories_data))
            db.session.commit()
      
 
        
        result = blog_schema.dump(new_blog)
        return make_response(jsonify(result), 201)


api.add_resource(Blog,'/blogs')

class BlogById(Resource):
    def get(self, id):
        single_blog = BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body, 404)
        else:
            result = blog_schema.dump(single_blog)
            return make_response(jsonify(result), 200)

    @jwt_required()
    def patch(self, id):
        data = update_post_parser.parse_args()
        single_blog = BlogPost.query.filter_by(id=id).first()

        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body, 404)
        else:
           
            user_id = current_user.id
            if single_blog.user_id != user_id:
                return jsonify({'error': 'Unauthorized'}), 401

            if data['title']:
                single_blog.title = data['title']
            if data['content']:
                single_blog.content = data['content']
            if data['excerpt']:
                single_blog.excerpt = data['excerpt']
            if data['category']:
                single_blog.excerpt = data['category']

           
            result = blog_schema.dump(single_blog)
            db.session.commit()

            return make_response(jsonify(result), 201)

    
    @jwt_required()
    def delete(self, id):
        single_blog = BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body, 404)
        else:
           
            user_id = current_user.id
            if single_blog.user_id != user_id:
                response_body = {"message": "401: Not Authorized"}
                return make_response(response_body, 401)


            Comment.query.filter_by(post_id=id).delete()
            Media.query.filter_by(post_id=id).delete()

            db.session.delete(single_blog)
            db.session.commit()
            response_body = {"message": "blog successfully deleted"}
            return make_response(response_body, 204)

api.add_resource(BlogById, "/blogs/<int:id>")



class BlogsByCategory(Resource):
    def get(self, category_name):
        category = Category.query.filter_by(name=category_name).first()
        if not category:
            response_body = {"error": "Category not found"}
            return make_response(response_body, 404)

        blogs = BlogPost.query.filter(BlogPost.categories.any(id=category.id)).all()
        result = blog_schema.dump(blogs, many=True)
        return make_response(jsonify(result), 200)

api.add_resource(BlogsByCategory, "/categories/<category_name>")
