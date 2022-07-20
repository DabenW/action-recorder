export class Recorder {
    constructor(){
        this.x = 0
        this.y = 0
    }

    record() {
        document.onmousemove = (e) => {
            let x1 = e.clientX;
            let y1 = e.clientY;

            if (this.x != x1 || this.y != y1) {
                console.log(e.clientX, e.clientY)
                console.log("鼠标")
            }
            this.x = x1;
            this.y = y1;
        }

        document.onkeydown = (e) => {
            console.log("键盘敲击")
        }
    }
} 