(function(){
    let wave = {leftCounter : 0, rightCounter : 0};
    gest.start();
    gest.options.subscribeWithCallback(function (gesture) {
        console.log(gesture);
        if(gesture.left){
            wave.leftCounter++;
            wave.rightCounter = 0;
            wave.leftCounter > 1 ? window.location='index.html' : undefined; 
        }else if(gesture.right){
            wave.leftCounter = 0;
            wave.rightCounter++;
            wave.rightCounter > 1 ? window.location='rasberry.html' : undefined;
        }else{
            wave.leftCounter = 0;
            wave.rightCounter = 0;
        }
    });
})();