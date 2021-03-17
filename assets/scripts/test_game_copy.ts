const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    cat: cc.Node = null;

    @property(cc.Node)
    dog: cc.Node = null;

    @property(cc.Node)
    fish: cc.Node = null;

    @property(cc.Node)
    mouse: cc.Node = null;

    @property
    optionNodesInitialPosition = new Array(4);
    selectedNode = null;

    onLoad () {

        this.getOptionNodesInitialPositions();

        this.cat.on(cc.Node.EventType.TOUCH_START, (event)=>{
            this.selectNode(this.cat);
        })

        this.cat.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.moveNode(event,this.cat);
        });

        this.cat.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.placeNode(event,this.cat);
        })

        this.cat.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.setToInitial(this.cat);
        })

        this.dog.on(cc.Node.EventType.TOUCH_START, (event)=>{
            this.selectNode(this.dog);
        })

        this.dog.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.moveNode(event,this.dog);
        });

        this.dog.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.placeNode(event,this.dog);
        })

        this.dog.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.setToInitial(this.dog);
        })

        this.fish.on(cc.Node.EventType.TOUCH_START, (event)=>{
            this.selectNode(this.fish);
        })

        this.fish.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.moveNode(event,this.fish);
        });

        this.fish.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.placeNode(event,this.fish);
        })

        this.fish.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.setToInitial(this.fish);
        })

        this.mouse.on(cc.Node.EventType.TOUCH_START, (event)=>{
            this.selectNode(this.mouse);
        })

        this.mouse.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.moveNode(event,this.mouse);
        });

        this.mouse.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.placeNode(event,this.mouse);
        })

        this.mouse.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.setToInitial(this.mouse);
        })

    }

    getOptionNodesInitialPositions(){
        this.optionNodesInitialPosition.push([this.cat.x,this.cat.y]);
        this.optionNodesInitialPosition.push([this.dog.x,this.dog.y]);
        this.optionNodesInitialPosition.push([this.fish.x,this.fish.y]);
        this.optionNodesInitialPosition.push([this.mouse.x,this.mouse.y]);

        this.optionNodesInitialPosition.forEach(element => {
            console.log('initial positions:', element[0],element[1]);
        });
    }

    selectNode(node){

        if(this.selectedNode == null){
            this.selectedNode = node;
            node.opacity = 100;
        }
    }

    moveNode(event,node){

        if(this.selectedNode != node)
            return;
    
        var delta = event.touch.getDelta();

        var option = this.node.getChildByName('options');

        let minX = -option.parent.width/2 + node.width/2;
        let maxX = option.parent.width / 2 - node.width / 2;
        let minY = -option.parent.height / 2 + node.height / 2;
        let maxY = option.parent.height / 2 - node.height / 2;
        let moveX = node.x + delta.x;
        let moveY = node.y + delta.y;
        
        if(moveX < minX){
            moveX = minX;
        }else if(moveX > maxX){
            moveX = maxX;
        }
        if(moveY < minY){
            moveY = minY;
        }else if(moveY > maxY){
            moveY = maxY;
        }

        node.x = moveX;
        node.y = moveY;

    }

    placeNode(event,node){

        var inDropzone = false;
        var nodeName = node.name;
        var dropzoneSet = this.node.getChildByName('dropzones');
        var nodePosition = this.node.convertToWorldSpaceAR(node.getPosition());

        for(let i=1;i<5;i++){
            var frameName  = "frame"+ i.toString();
            var _dropZoneNode = dropzoneSet.getChildByName(frameName);

            if(_dropZoneNode.getBoundingBoxToWorld().contains(nodePosition)){
                inDropzone = true
                node.x = _dropZoneNode.x;
                node.y = _dropZoneNode.y;
                node.opacity = 255;
            }
        }

        if(!inDropzone){
            var nodeNumber = 0;
            if(nodeName.localeCompare('cat') == 0)
                nodeNumber = 1;
            else if(nodeName.localeCompare('dog') == 0)
                nodeNumber = 2;
            else if(nodeName.localeCompare('fish') == 0)
                nodeNumber = 3;
            else if(nodeName.localeCompare('mouse') == 0)
                nodeNumber = 4;

            console.log(nodeName,'-----',nodeNumber);
            console.log('original positions: ',this.optionNodesInitialPosition[nodeNumber-1][0],',',this.optionNodesInitialPosition[nodeNumber-1][1])
            node.opacity = 255;

            cc.tween(node)
            .to(0.5,{position: cc.v2(this.optionNodesInitialPosition[nodeNumber-1][0],this.optionNodesInitialPosition[nodeNumber-1][1])},{easing:'cubicInOut'})
            .start();
        }

        this.selectedNode = null;
    }

    setToInitial(node){
        node.opacity = 255;
        var nodeName = node.name;
        var nodeNumber = 0;

        if(nodeName.localeCompare('cat') == 0)
            nodeNumber = 1;
        else if(nodeName.localeCompare('dog') == 0)
            nodeNumber = 2;
        else if(nodeName.localeCompare('fish') == 0)
            nodeNumber = 3;
        else if(nodeName.localeCompare('mouse') == 0)
            nodeNumber = 4;

        cc.tween(node)
        .to(0.5,{position: cc.v2(this.optionNodesInitialPosition[nodeNumber-1][0],this.optionNodesInitialPosition[nodeNumber-1][1])},{easing:'cubicInOut'})
        .start();

        this.selectedNode = null;
    }

    start () {

    }

    // update (dt) {}
}
