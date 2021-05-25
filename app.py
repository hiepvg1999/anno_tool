from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
from io import BytesIO
import re
import json

from PIL import Image
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg

app = Flask(__name__)
CORS(app)
config = Cfg.load_config_from_name('vgg_transformer')
config['device'] = 'cpu'
config['cnn']['pretrained']=False
config['predictor']['beamsearch']=False
config['weights'] = './model/transformerocr.pth'
detector = Predictor(config)
@app.route("/")
def main():
    return "Flask server"
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        img = Image.open(data['image_path'][1:])
        result_arr = {}
        for en in data['entities']:
            box = en['box']
            img_crop = img.crop((box[0],box[1],box[2],box[3]))
            result = detector.predict(img_crop)
            result_arr[en['id']] = result
    return jsonify({"data":result_arr})


if __name__ == "__main__":
    app.run(port=5000, debug=True, use_reloader=True)