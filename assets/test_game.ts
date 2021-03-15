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
    initialPosition = new Array(4);

    getInitialPositions(){
        return [[this.cat.x,this.cat.y],
                [this.dog.x,this.dog.y],
                [this.fish.x,this.fish.y],
                [this.mouse.x,this.mouse.y]];
    }

    getPlaceHolderSno(objectX,objectY){
        var result = 0;
        var flag = 0;
        for(let i=1; i<5; i++){
            var frameName = 'frame'+ i.toString()
            var getPlaceHolderSno = this.node.getChildByName(frameName);
            if(getPlaceHolderSno.getBoundingBox().contains(cc.v2(objectX,objectY))){
                return i;
            }
        }
        if(flag == 0)
            return 0;
    }

    getObject(x,y){
        var cat = this.node.getChildByName('cat');
        var dog = this.node.getChildByName('dog');
        var fish = this.node.getChildByName('fish');
        var mouse = this.node.getChildByName('mouse');

        if(dog.getBoundingBox().contains(cc.v2(x,y))){
            return [dog,2];
        }
        else if(cat.getBoundingBox().contains(cc.v2(x,y))){
            return [cat,1];
        }
        else if(fish.getBoundingBox().contains(cc.v2(x,y))){
            return [fish,3];
        }
        else if(mouse.getBoundingBox().contains(cc.v2(x,y))){
            return [mouse,4];
        }
    }

    onLoad () {
        var touch = false;
        this.initialPosition = this.getInitialPositions();
        var object;
        var obj;
        var flag = 0;
        
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            if(flag != 0)
                 event.preventDefault();
            flag += 1;
            obj= this.getObject(this.node.convertTouchToNodeSpaceAR(event).x,this.node.convertTouchToNodeSpaceAR(event).y);
            object = obj[0];
            object.opacity = 100;
            touch = true;
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            if(!touch) 
                return;
            
            if(flag != 1)
                return;

            object.opacity = 100;

            let delta = event.getDelta();

            let minX = -object.parent.width/2 + object.width/2;
            let maxX = object.parent.width / 2 - object.width / 2;
            let minY = -object.parent.height / 2 + object.height / 2;
            let maxY = object.parent.height / 2 - object.height / 2;
            let moveX = object.x + delta.x;
            let moveY = object.y + delta.y;
            
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

            object.x = moveX;
            object.y = moveY;
        })

        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            touch = false;
            flag = 0;
            var placeholder = this.getPlaceHolderSno(object.x,object.y);
            if(placeholder != 0){
                var frameName = "frame" + placeholder.toString();
                var placeHolderSno = this.node.getChildByName(frameName);
                object.x = placeHolderSno.x;
                object.y = placeHolderSno.y;
                object.opacity = 255;
            }
            else{
                cc.tween(object)
                .to(0.5,{position: cc.v2(this.initialPosition[obj[1]-1][0],this.initialPosition[obj[1]-1][1])},{easing:'cubicInOut'})
                .start();
                object.opacity = 255;
            }
            
        })

    }

    start () {

    }

    // update (dt) {}
}
