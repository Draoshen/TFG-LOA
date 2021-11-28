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
    constructor(posX, posY,color,tieneFicha,id,_casillaCanvas,idTablero) {
        this.posX=posX;
        this.posY=posY;
        this.color=color;
        this.tieneFicha=tieneFicha;
        this.id=id;
        this.idTablero=idTablero;
        this.CasillaLimite=false;
        this.casillaCanvas=this.casillaCanvas;
    }
  }
  class fichaTablero {
    constructor(casilla,jugador,gameScene,casillaObjeto) {
        this.casillaObjeto=casillaObjeto;
        this.casilla=casilla;
        this.jugador=jugador;
        this.fichaCanvas=gameScene.add.circle(500, 500, 40, colorFichasPruebas).setInteractive();
        this.fichaCanvas.on('pointerdown', function() {

            casilla.setInteractive();
            casilla.setStrokeStyle(4,0xE6EF2D);
             });
        
         this.fichaCanvas.on('pointerup', function() {

                casilla.setInteractive();
                casilla.setStrokeStyle(0,0x000000);
                //console.log();
                 });
    }
    get movimientos(){
        let casillasMovimientos =[];
        let casillasMovimientosObject=[];
    }
    
  }

//casillasBoard : CasillaTablero = [64];
let casillasBoard = [];
let CasillasLimites=[];
let fichasNegras = [];
let identificadoresTablero=[];
const colorFichasNegras = 0x3B292C;
const colorFichasBlancas = 0x964C3E;
const colorFichasPruebas= 0x44327E;
let fichasBlancas=[];
var game = new Phaser.Game(config);
const casillas=[];
let numFilas=8;
let numColumnas=8;
let idTableroCalc="";
let idTableroCalcFila="";
const letrasTablero=["a","b","c","d","e","f","g","h"];
for (let i = 0; i < numFilas; i++) {
    idTableroCalcFila=""+8-i;
    for (let j = 0; j < numColumnas; j++) {
        idTableroCalc=idTableroCalcFila+letrasTablero[j];
        identificadoresTablero[(i*8)+j]=idTableroCalc;
    }
    
}
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

        let fichaLimite=false;
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
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX,adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorBlancasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorBlancasTablero,false,fila*8+i,casillas[fila*8+i],identificadoresTablero[fila*8+i]);
                    }
                    else
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX, adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorNegrasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorNegrasTablero,false,fila*8+i,casillas[fila*8+i],identificadoresTablero[fila*8+i]);
                    //casillas[i].setOrigin(0,0);
                    // console.log(casillas[i]);
                }
                else
                    if (i%2==0) {
                        //Esto es PAR
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX,adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorNegrasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorNegrasTablero,false,fila*8+i,casillas[fila*8+i],identificadoresTablero[fila*8+i]);
                    }
                    else
                        casillas[fila*8+i] = this.add.rectangle(adjust+i*coordenadaX, adjust+fila*coordenadaY, ladoCasilla, ladoCasilla, colorBlancasTablero);
                        casillasBoard[fila*8+i]= new CasillaTablero(adjust+i*coordenadaX,adjust+fila*coordenadaY,colorBlancasTablero,false,fila*8+i,casillas[fila*8+i],identificadoresTablero[fila*8+i]);
                    //casillas[i].setOrigin(0,0);
                    // console.log(casillas[i]);
                    
                
             }
            
        }
        
        //let casillaPrueba= new CasillaTablero(0,0,0,false,0,this.add.rectangle(0,0,40,40,0xefc53f));
        


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
                console.log("Has selecionado una fichas Negra");

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
        function actualizarFichasLimites(){
            const numFilas=8;
            const numColumnas=8;
            for (let i = 0; i < numFilas; i++) {
                for (let j = 0; j < numColumnas; j++) {
                    if (i==0 || i == numFilas-1 || j==0 || j==numColumnas-1) {
                        casillasBoard[(i*8)+j].CasillaLimite=true;
                        CasillasLimites.push(casillas[(i*8)+j]);
                    }
                }
                
                
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
        actualizarFichasLimites();
        colocarFichasBlancas();
        colocarFichasNegras();
        function pintarBordeTablero(){
            CasillasLimites.forEach(element => {
                element.setInteractive();
                element.setStrokeStyle(4,0xE6EF2D);
            });
        }
        function verticalesFicha(fichita){
            let casillasVerticales =[];
            let casillaActual = fichita.casillaObjeto;
            let idFichaFila=casillaActual.idTablero.split[0];
            let idFichaColumna=casillaActual.idTablero.split[1];
            let idFichaCalc=casillaActual.idTablero;
            //let casillaCandidata;
            for (let i = 1; idFichaCalc.includes("8"); i++) {
                idFichaCalc=idFichaFila+i+""+idFichaColumna;
                casillasVerticales.push();
                
            }
            for (let i = 1; idFichaCalc.includes("1"); i--) {
                idFichaCalc=idFichaFila-i+""+idFichaColumna;
                casillasVerticales.push();
                
            }
            console.log(casillasVerticales)
            return casillasVerticales;
        }
        
        //pintarBordeTablero();
    //    identificadoresTablero.forEach(element => {
    //        console.log(element);
    //    }); 
        casillasBoard.forEach(element => {
            //console.log(element);
        });
        /*this.input.on('pointerdown', function(pointer){
            var touchX = pointer.x;
            var touchY = pointer.y;
            console.log("Estás clickando en: "+touchX);
            console.log("Estás clickando en Y: "+touchY);
            // ...
         });
         */
        
    
    emitter.startFollow(logo);
    let myFichaPrueba = new fichaTablero(casillas[36],"blancas",this,casillasBoard[36]);
    casillasBoard[36].tieneFicha=true;
    myFichaPrueba.fichaCanvas.on('pointerup', function() {

       console.log(myFichaPrueba);
         });
    
    //tablero();
    verticalesFicha(myFichaPrueba);
}