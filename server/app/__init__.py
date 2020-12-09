#-*-coding:utf-8-*-
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey123'
app.config['WX_GROUP'] = '666'

socketio = SocketIO(app)

'''
注册蓝图
'''
from .core.wxChat import wxChat
app.register_blueprint(wxChat)
