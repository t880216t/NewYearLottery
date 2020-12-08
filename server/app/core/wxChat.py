import json, base64
from flask import Blueprint, request
from .. import socketio
from logzero import logger
from wxpy import *

wxChat = Blueprint('wxChat', __name__)

bot = Bot(cache_path=True)

my_groups = []
bot.groups(update=True, contact_only=False)
listen_group = bot.groups().search('666')[0]
listen_group.update_group(members_details=True)
my_groups.append(listen_group)


def ByteToHex(bins):
  return ''.join(["%02X" % x for x in bins]).strip()

@bot.register(my_groups[0], except_self=False)
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
