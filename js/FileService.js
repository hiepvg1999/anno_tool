import State from "./State.js"
import BoxService from "./BoxService.js"
import LinkingService from "./LinkingService.js"

export default class FileService {
    static getImageFilePath() {
        return "../source/" + FileService.getImageName() + ".jpg"
    }

    static getJsonFilePath() {
        return "../source/" + FileService.getImageName() + ".json"
    }

    static getImageName() {
        console.log(State.currentFileNumber)
        // return "image_" + ('00' + State.currentFileNumber).slice(-3)
        return State.files[State.currentFileNumber]
    }

    static generateJsonString() {
        let entities = []
        for (let box of State.boxArray) {
            if (box === undefined) {
                continue
            }
            //For each boxes we check every links that it's linked to and add it to its list of links
            let fromLinks = box.originLinks.map(link => [State.linkArray[link].from, State.linkArray[link].to]).filter(link => link !== null)
            let toLinks = box.destinationLinks.map(link => [State.linkArray[link].from, State.linkArray[link].to]).filter(link => link !== null)
            let boxObj = box.box
            var obj = {
                id: boxObj.id,
                text: box.content,
                label: box.label,
                box: [
                    //Don't forget to scale the boxes coordinates to the image true size
                    parseFloat(Number(((boxObj.aCoords.tl.x * 1000) / (State.image.scaleX * 1000))).toFixed(2)),
                    parseFloat(Number(((boxObj.aCoords.tl.y * 1000) / (State.image.scaleY * 1000))).toFixed(2)),
                    parseFloat(Number((((boxObj.aCoords.tl.x + boxObj.width) * 1000) / (State.image.scaleX * 1000))).toFixed(2)),
                    parseFloat(Number((((boxObj.aCoords.tl.y + boxObj.height) * 1000) / (State.image.scaleY * 1000))).toFixed(2))
                ],
                linking: [...fromLinks, ...toLinks]
            }
            entities.push(obj)
        }

        return JSON.stringify(entities)
    }

    static loadJson() {
        let req = new XMLHttpRequest()
        req.open("GET", FileService.getJsonFilePath(),false)
        req.send()
        if (req.status === 404) {
            return
        }

        let objects = JSON.parse(req.responseText);
        console.log(objects)
        let boxObjects = FileService.parseVisionResponse2(objects)

        BoxService.createBoxesFromArray(boxObjects)
    }

    static loadFromJsonString(str) {
        let objects = JSON.parse(str)
        //Creating the boxes and links
        BoxService.createBoxesFromArray(objects)
        LinkingService.createLinksFromArray(objects)
    }
    static parseVisionResponse2(obj_arr) {
        let boxObjects = []
        for (let i = 0; i< obj_arr.length; i++){
            let leftX = obj_arr[i].box[0] > obj_arr[i].box[2] ? obj_arr[i].box[2]: obj_arr[i].box[0]
            let rightX = obj_arr[i].box[0] > obj_arr[i].box[2] ? obj_arr[i].box[0]: obj_arr[i].box[2]
            boxObjects.push({
                id: i,
                text: obj_arr[i].text,
                box: [
                    leftX,
                    obj_arr[i].box[1],
                    rightX,
                    obj_arr[i].box[3],
                ],
                label: obj_arr[i].label,
                linking: obj_arr[i].linking
            })
        }
        return boxObjects
    }
    static parseVisionResponse(obj) {
        let boxObjects = []
        //We start at 1 because the 1st object is a concatenation of all the strings
        for (let i = 1; i < obj.textAnnotations.length; i++) {

            //We need to do that because vision sometimes reverse the left and right coords so then we have negative
            // width which causes problems when drawing link buttons
            let leftX = obj.textAnnotations[i].boundingPoly.vertices[1].x > obj.textAnnotations[i].boundingPoly.vertices[3].x ?
                obj.textAnnotations[i].boundingPoly.vertices[3].x :
                obj.textAnnotations[i].boundingPoly.vertices[1].x
            let rightX = obj.textAnnotations[i].boundingPoly.vertices[1].x > obj.textAnnotations[i].boundingPoly.vertices[3].x ?
                obj.textAnnotations[i].boundingPoly.vertices[1].x :
                obj.textAnnotations[i].boundingPoly.vertices[3].x
            boxObjects.push({
                id: i - 1,
                text: obj.textAnnotations[i].description,
                box: [
                    leftX,
                    obj.textAnnotations[i].boundingPoly.vertices[1].y,
                    rightX,
                    obj.textAnnotations[i].boundingPoly.vertices[3].y
                ],
                label: "",
                linking: []
            })
        }
        return boxObjects
    }
}