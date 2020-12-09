import json, base64
from flask import Blueprint, request
from .. import socketio, app
from logzero import logger
from wxpy import *

wxChat = Blueprint('wxChat', __name__)

'''
weixin机器人初始化
'''
bot = Bot(cache_path=True)
listen_groups = []
bot.groups(update=True, contact_only=False)
search_group = bot.groups().search(app.config['WX_GROUP'])
if len(search_group) > 0:
  listen_group = search_group[0]
  listen_group.update_group(members_details=True)
  listen_groups.append(listen_group)

@bot.register(listen_groups[0], except_self=False)
def system_msg(msg):
    """接收系统消息"""
    user = msg.member
    avatar_byte = user.get_avatar()
    avatar_str = base64.b64encode(avatar_byte).decode('utf-8')
    avatar_base64 = 'data:image/png;base64,{}'.format(avatar_str)
    print(msg)
    if msg.text and '红包' in msg.text:
      content = {
        'type': 'Text',
        'id': msg.id,
        'from': msg.member.name,
        'text': '[发了一个红包，快去抢]',
        'avatar': avatar_base64,
      }
    elif msg.type == 'Picture':
      content = {
        'type': 'Text',
        'id': msg.id,
        'from': msg.member.name,
        'text': '[不支持的消息，请在手机上查看]',
        'avatar': avatar_base64,
      }
    else:
      content = {
        'type': msg.type,
        'id': msg.id,
        'from': msg.member.name,
        'text': msg.text,
        'avatar': avatar_base64,
      }
    socketio.emit('server_response',{'code': 0, 'command': 'sync_message', 'content': content})

@socketio.on('connect')
def client_connect():
    logger.info(str(request.sid) + '=> Client Connected ')
    socketio.emit('server_response',
                  json.dumps({'code': 0, 'command': 'set_config', 'content': '初始化连接'}))
