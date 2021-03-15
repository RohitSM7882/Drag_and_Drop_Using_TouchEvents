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

    getMovement(touch, object, sno){

        object.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            if(!touch) 
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

        object.on(cc.Node.EventType.TOUCH_END, (event)=>{
            touch = false;

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
                .to(0.5,{position: cc.v2(this.initialPosition[sno-1][0],this.initialPosition[sno-1][1])},{easing:'cubicInOut'})
                .start();
                object.opacity = 255;
            }
            
        })
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

    onLoad () {
        var touch = false;
        this.initialPosition = this.getInitialPositions();

        this.cat.on(cc.Node.EventType.TOUCH_START, (event)=>{
            touch = true;
            this.getMovement(touch,this.cat, 1);
        });

        this.dog.on(cc.Node.EventType.TOUCH_START, (event)=>{
            touch = true;
            this.getMovement(touch,this.dog, 2);
        });

        this.fish.on(cc.Node.EventType.TOUCH_START, (event)=>{
            touch = true;
            this.getMovement(touch,this.fish, 3);
        });

        this.mouse.on(cc.Node.EventType.TOUCH_START, (event)=>{
            touch = true;
            this.getMovement(touch,this.mouse, 4);
        });
    }

    start () {

    }

    // update (dt) {}
}
