var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};
class CasillaTablero {
    constructor(posX, posY,color,tieneFicha,id,casillaCanvas) {
        this.posX=posX;
        this.posY=posY;
        this.color=color;
        this.tieneFicha=tieneFicha;
        this.id=id;
        this.casillaCanvas=this.casillaCanvas;
    }
  }
//casillasBoard : CasillaTablero = [64];
let casillasBoard = [];
let fichasNegras = [];
const colorFichasNegras = 0x3B292C;
const colorFichasBlancas = 0x964C3E;
let fichasBlancas=[];
var game = new Phaser.Game(config);
const casillas=[];

function preload ()
{
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create ()
{   
    let escena=this; 
   //this.add.image(400, 300, 'sky');
   //scene.input.enabled = enabled; // enabled: true/false
    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    
        let coordenadaX=100;
        let coordenadaY=100;
        const colorNegrasTablero=0xBB7F36;
        const colorBlancasTablero=0xEEDCC3;
        const ladoCasilla=100;
        let adjust=100;
        let tocaCambiarFila=false;
        for (let fila = 0; fila <8; fila++) {
            if (fila%2==1) {
                tocaCambiarFila=true;
            }
            else{
                tocaCambiarFila=false;
            }
            for (var i = 0; i < 8; i++) {
                if (tocaCambiarFila==false) {
                    if (i%2==0) {
                        //Esto es PAR
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX,adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorNegrasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorNegrasTablero,false,fila*8+i,casillas[fila*8+i]);
                    }
                    else
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX, adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorBlancasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorNegrasTablero,false,fila*8+i,casillas[fila*8+i]);
                    //casillas[i].setOrigin(0,0);
                    // console.log(casillas[i]);
                }
                else
                    if (i%2==0) {
                        //Esto es PAR
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX,adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorBlancasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorNegrasTablero,false,fila*8+i,casillas[fila*8+i]);
                    }
                    else
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX, adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorNegrasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorNegrasTablero,false,fila*8+i,casillas[fila*8+i]);
                    //casillas[i].setOrigin(0,0);
                    // console.log(casillas[i]);
                    
                
             }
            
        }
        
        let casillaPrueba= new CasillaTablero(0,0,0,false,0,this.add.rectangle(0,0,40,40,0xefc53f));
    
        let myFicha=this.add.circle(600, 800, 40, 0xc70039).setInteractive();
        myFicha.on('pointerdown', function() {
            console.log('ficha seleccionada');

        });
        this.input.setDraggable(myFicha);
        
        this.input.on('drag', function (pointer, myFicha, dragX, dragY) {

            myFicha.x = dragX;
            myFicha.y = dragY;
    
        });

        function colocarFichasNegras(){
            var positionX;
            var positionY;
            //Primera fila
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[index].posX;
                positionY=casillasBoard[index].posY;

                //Añadimos la fichita
                fichasNegras[i]=escena.add.circle(positionX, positionY, 40, colorFichasNegras).setInteractive();
                fichasNegras[i].on('pointerdown', function() {
                console.log('ficha seleccionada');
                console.log("Has selecionado una fichas Blanca");

                 });
            }
            //Ultima fila
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[index+56].posX;
                positionY=casillasBoard[index+56].posY;

                //Añadimos la fichita
                fichasNegras[i]=escena.add.circle(positionX, positionY, 40, colorFichasNegras).setInteractive();
                fichasNegras[i].on('pointerdown', function() {
                console.log('ficha seleccionada');
                console.log("Has selecionado una fichas Negra");

                 });
            }
        }
        function colocarFichasBlancas(){
            var positionX;
            var positionY;
            //Primera fila
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[index*8].posX;
                positionY=casillasBoard[index*8].posY;

                //Añadimos la fichita
                fichasBlancas[i]=escena.add.circle(positionX, positionY, 40, colorFichasBlancas).setInteractive();
                fichasBlancas[i].on('pointerdown', function() {
                console.log('ficha seleccionada');
                console.log("Has selecionado una fichas Blanca");

                 });
            }
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[(index+1)*8-1].posX;
                positionY=casillasBoard[(index+1)*8-1].posY;

                //Añadimos la fichita
                fichasBlancas[i]=escena.add.circle(positionX, positionY, 40, colorFichasBlancas).setInteractive();
                fichasBlancas[i].on('pointerdown', function() {
                console.log('ficha seleccionada');
                console.log("Has selecionado una fichas Blanca");

                 });
            }
            //Ultima fila
            
        }
        colocarFichasBlancas();
        colocarFichasNegras();
        console.log(casillas.length);
        casillas[1].setStrokeStyle(4, 0xefc53f);   
        casillas[8].setInteractive();
        casillas[8].setStrokeStyle(4, 0x4D4B85);
        console.log(casillasBoard[62]);
        
        casillasBoard.forEach(element => {
            console.log(element);
        });
        /*this.input.on('pointerdown', function(pointer){
            var touchX = pointer.x;
            var touchY = pointer.y;
            console.log("Estás clickando en: "+touchX);
            console.log("Estás clickando en Y: "+touchY);
            // ...
         });
         */
        console.log(casillaPrueba);
        console.log(casillasBoard[1].posX+":"+casillasBoard[1].posY);
    emitter.startFollow(logo);
    //tablero();
}