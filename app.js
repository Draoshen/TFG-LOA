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
        this.casillaCanvas;
    }
    setCasillaCanvas(casilla){
        this.casillaCanvas=casilla;
    }
    setCasillaTieneFicha(Ficha){
        this.tieneFicha=Ficha;
    }

  }


//casillasBoard : CasillaTablero = [64];
let casillasBoard = [];
let CasillasLimites=[];
let casillasHighlighted=[];
let fichaSeleccionada=null;
let fichasNegras = [];
let identificadoresTablero=[];
let turnoPartida=true;
let partidaAcabada=false;
const colorFichasNegras = 0x3B292C;
const colorFichasBlancas = 0x964C3E;
const colorFichasPruebas= 0x44327E;
let fichasBlancas=[];
var game = new Phaser.Game(config);
const casillas=[];
let fichaDummy;
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
    class fichaTablero {
        constructor(casilla,jugador,gameScene,casillaObjeto) {
            
            casillaObjeto.tieneFicha=jugador;
            this.casillaObjeto=casillaObjeto;
            this.casilla=casilla;
            this.jugador=jugador;
            this.fichaPosX=casillaObjeto.posX;
            this.fichaPosY=casillaObjeto.posY;
            this.movesV;
            this.movesH;
            this.movesD_A;
            this.movesD_D;
            let Ficha=this;
            let posiblesMoves=[];
            let indexMoves=0;
            if (jugador=="blancas") {
                this.fichaCanvas=gameScene.add.circle(casillaObjeto.posX, casillaObjeto.posY, 40, colorFichasBlancas).setInteractive();
            }
            else{
                this.fichaCanvas=gameScene.add.circle(casillaObjeto.posX, casillaObjeto.posY, 40, colorFichasNegras).setInteractive();
            }
                this.fichaCanvas.on('pointerdown', function() {
                if (turnoPartida==true && jugador=="blancas" && partidaAcabada==false) {
                    if (fichaSeleccionada!=null) {
                        fichaSeleccionada.setStrokeStyle(0,0x000000);
                    }
                    fichaSeleccionada=Ficha.fichaCanvas;
                    Ficha.fichaCanvas.setStrokeStyle(4,0xE5E228);
                    casilla.setInteractive();
                    //casilla.setStrokeStyle(4,0xE6EF2D);
                    moveFicha(Ficha);
                }
                if (turnoPartida==false &&jugador==="negras" && partidaAcabada==false) {
                    if (fichaSeleccionada!=null) {
                        fichaSeleccionada.setStrokeStyle(0,0x000000);
                    }
                    fichaSeleccionada=Ficha.fichaCanvas;
                    Ficha.fichaCanvas.setStrokeStyle(4,0xE5E228);
                    casilla.setInteractive();
                    //casilla.setStrokeStyle(4,0xE6EF2D);
                    moveFicha(Ficha);
                }
                     });
    
                
                 this.fichaCanvas.on('pointerup', function() {
        
                        casilla.setInteractive();
                        casilla.setStrokeStyle(0,0x000000);
                        //console.log();
                         });

        }
        
      }

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
        let gameScene =this;
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
        let arrayTxtLetras= [];
        let arrayTxtNumeros=[];
        const letrasTableroMayus=["A","B","C","D","E","F","G","H"];
        for (let i = 0; i < letrasTableroMayus.length; i++) {
           arrayTxtLetras[i] = this.add.text(80+i*100, 855, letrasTableroMayus[i], { font: '64px Arial' });
           arrayTxtNumeros[i]= this.add.text(10,70+i*100, 8-i, { font: '64px Arial' });
        }
        for (let i = 0; i < casillasBoard.length; i++) {
            casillasBoard[i].setCasillaCanvas(casillas[i]);
        }
        const letrasTablero=["a","b","c","d","e","f","g","h"];
        let mapColors = new Map();
        let mapCasillasHighlighted= new Map();
        mapColors.set("blancas",colorFichasBlancas);
        mapColors.set("negras",colorFichasNegras);
        let map1 = new Map();
        for (let i = 0; i < numFilas; i++) {
            for (let j = 0; j < numColumnas; j++) {
                map1.set(8-i+letrasTablero[j],(i*8)+j)
            }
            
        }
        //let casillaPrueba= new CasillaTablero(0,0,0,false,0,this.add.rectangle(0,0,40,40,0xefc53f),this);
        


        function fichasDeAlrededor(Ficha){
            let fichasDeAlrededor=[];
            let idFichaFila=parseInt(Ficha.casillaObjeto.idTablero.split("")[0]);
            let idFichaColumna=Ficha.casillaObjeto.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            //Para las horizontales
            HorizontalesFicha(Ficha).forEach(element =>{
                if (element==idFichaFila+(letrasTablero[indexLetrasCasilla-1])) {
                    fichasDeAlrededor.push(element);
                }
                if (element==idFichaFila+(letrasTablero[indexLetrasCasilla+1])) {
                    fichasDeAlrededor.push(element);
                }
            });
            verticalesFicha(Ficha).forEach(element =>{
                if (element==(idFichaFila-1)+letrasTablero[indexLetrasCasilla]) {
                    fichasDeAlrededor.push(element);
                }
                if (element==(idFichaFila+1)+letrasTablero[indexLetrasCasilla]) {
                    fichasDeAlrededor.push(element);
                }
            });
            DiagonalDescendenteFicha(Ficha).forEach(element =>{
                if (element==(idFichaFila+1)+letrasTablero[indexLetrasCasilla-1]) {
                    fichasDeAlrededor.push(element);
                }
                if (element==(idFichaFila-1)+letrasTablero[indexLetrasCasilla+1]) {
                    fichasDeAlrededor.push(element);
                }
            });
            DiagonalAscendenteFicha(Ficha).forEach(element =>{
                if (element==(idFichaFila+1)+letrasTablero[indexLetrasCasilla+1]) {
                    fichasDeAlrededor.push(element);
                }
                if (element==(idFichaFila-1)+letrasTablero[indexLetrasCasilla-1]) {
                    fichasDeAlrededor.push(element);
                }
            });
            // fichasDeAlrededor.push(verticalesFicha(Ficha));
            // fichasDeAlrededor.push(DiagonalAscendenteFicha(Ficha));
            // fichasDeAlrededor.push(DiagonalDescendenteFicha(Ficha));
            return fichasDeAlrededor;
        }
        function fichasConectadas(Ficha){
            //getFichaByCasilla();
            let fichasConectadas =[];
            fichasConectadas.push(Ficha.casillaObjeto.idTablero);
            fichasConectadasRec(Ficha,Ficha.casillaObjeto.idTablero,fichasConectadas);
            return fichasConectadas;
        }
        function fichasConectadasRec(Ficha,idTablero,fichasConectadas){
            fichasDeAlrededor(Ficha).forEach(element => {
                if(casillasBoard[map1.get(element)].tieneFicha==Ficha.jugador && !fichasConectadas.includes(element) ){
                    fichasConectadas.push(element);
                    fichasConectadasRec(getFichaByIdBoard(element),element,fichasConectadas);
                }
                return fichasConectadas;
            });
            return fichasConectadas;
        }


        function colocarFichasNegras(){
            let i=0;
            var positionX;
            var positionY;
            //Primera fila
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[index].posX;
                positionY=casillasBoard[index].posY;

                //Añadimos la fichita
                fichasNegras[i]=new fichaTablero(casillas[index],"negras",escena,casillasBoard[index]);
                i++;
            }
            //Ultima fila
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[index+56].posX;
                positionY=casillasBoard[index+56].posY;

                //Añadimos la fichita
                fichasNegras[i]=new fichaTablero(casillas[index+56],"negras",escena,casillasBoard[index+56]);;
                i++;
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
        function getFichaByCasillasBoard(casilla){
            fichasNegras.forEach(element =>{
                if (""+element.casillaObjeto.id===""+casilla.id){
                    element.fichaCanvas.destroy();
                    element.casillaObjeto.tieneFicha=false;
                    element.casilla=null;
                    element=null;
                    return element
                }
            });
            fichasBlancas.forEach(element =>{
                if (""+element.casillaObjeto.id===""+casilla.id){
                    element.fichaCanvas.destroy();
                    element.casillaObjeto.tieneFicha=false;
                    element.casilla=null;
                    element=null;
                    return element
                }
            });
        }
        function getFichaByIdBoard(idTablero1){
            let ficha;
            for (let i = 0; i < fichasNegras.length; i++) {
                if (""+fichasNegras[i].casillaObjeto.idTablero===""+idTablero1){
                    return fichasNegras[i];//return element
                }
                
            }
            for (let i = 0; i < fichasBlancas.length; i++) {
                if (""+fichasBlancas[i].casillaObjeto.idTablero===""+idTablero1){
                    return fichasBlancas[i];//return element
                }
                
            }
        }
        function colocarFichasBlancas(){
            var positionX;
            var positionY;
            let i=0;
            //Primera fila
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[index*8].posX;
                positionY=casillasBoard[index*8].posY;

                //Añadimos la fichita
                fichasBlancas[i]=new fichaTablero(casillas[index*8],"blancas",escena,casillasBoard[index*8]);
                 i++;
            }
            for (let index = 1; index < 7; index++) {
                positionX=casillasBoard[(index+1)*8-1].posX;
                positionY=casillasBoard[(index+1)*8-1].posY;
                
                //Añadimos la fichita
                fichasBlancas[i]=new fichaTablero(casillas[(index+1)*8-1],"blancas",escena,casillasBoard[(index+1)*8-1]);;
                 i++;
            }
            //Ultima fila
            
        }
        function getCasillaObjetoById(idBoard){
            for (let i = 0; i < casillasBoard.length; i++) {
                if(casillasBoard[i].idTablero.localeCompare(idBoard)==0){
                    return casillasBoard[i].id
                }
                
            }
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
            let idFichaFila=parseInt(casillaActual.idTablero.split("")[0]);
            let idFichaColumna=casillaActual.idTablero.split("")[1];

            //console.log(idFichaFila+1);

            //Primero las de abajo;
            for (let i = 1;  idFichaFila-i>=1; i++) {
                casillasVerticales.push((idFichaFila-i)+idFichaColumna);                
             }
            for (let i = 1;  idFichaFila+i<=8; i++) {
                casillasVerticales.push((idFichaFila+i)+idFichaColumna);                
             }
            //console.log(casillasVerticales)
            return casillasVerticales;
        }
        function HorizontalesFicha(fichita){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasHorizontales =[];
            let casillaActual = fichita.casillaObjeto;
            let idFichaFila=casillaActual.idTablero.split("")[0];
            let idFichaColumna=casillaActual.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);



            //Primero las de abajo;
            for (let i = 1;  indexLetrasCasilla-i>=0; i++) {
                casillasHorizontales.push((idFichaFila)+letrasTablero[indexLetrasCasilla-i]);                
             }
             for (let i = 1;  indexLetrasCasilla+i<=7; i++) {
                casillasHorizontales.push((idFichaFila)+letrasTablero[indexLetrasCasilla+i]);                
             }
            return casillasHorizontales;
        }
        function HorizontalesFicha_ObjetoCasillas(ficha){
            let casillasHorizontales=HorizontalesFicha(ficha);
            let casillasHorizontalesIndices=[];
            let casillasHorizontalesObjeto=[];
            casillasHorizontales.forEach(element => {
                casillasHorizontalesIndices.push(getCasillaObjetoById(element));
            });
            casillasHorizontalesIndices.forEach(element =>{
                casillasHorizontalesObjeto.push(casillasBoard[element]);
            });
            casillasHorizontalesObjeto.push();
            return casillasHorizontalesObjeto;
        }
        function VerticalesFicha_ObjetoCasillas(ficha){
            let casillasVerticales=verticalesFicha(ficha);
            let casillasVerticalesIndices=[];
            let casillasVerticalesObjeto=[];
            casillasVerticales.forEach(element => {
                casillasVerticalesIndices.push(getCasillaObjetoById(element));
            });
            casillasVerticalesIndices.forEach(element =>{
                casillasVerticalesObjeto.push(casillasBoard[element]);
            });
            casillasVerticalesObjeto.push();
            return casillasVerticalesObjeto;
        }
        function DiagonalesDescenteFicha_ObjetoCasillas(ficha){
            let casillasDiagonalesDescente=DiagonalDescendenteFicha(ficha);
            let casillasDiagonalesDescenteIndices=[];
            let casillasDiagonalesDescenteObjeto=[];
            casillasDiagonalesDescente.forEach(element => {
                casillasDiagonalesDescenteIndices.push(getCasillaObjetoById(element));
            });
            casillasDiagonalesDescenteIndices.forEach(element =>{
                casillasDiagonalesDescenteObjeto.push(casillasBoard[element]);
            });
            casillasDiagonalesDescenteObjeto.push();
            return casillasDiagonalesDescenteObjeto;
        }
        function DiagonalesAscendenteFicha_ObjetoCasillas(ficha){
            let casillasDiagonalesAscendente=DiagonalAscendenteFicha(ficha);
            let casillasDiagonalesAscendenteIndices=[];
            let casillasDiagonalesAscendenteObjeto=[];
            casillasDiagonalesAscendente.forEach(element => {
                casillasDiagonalesAscendenteIndices.push(getCasillaObjetoById(element));
            });
            casillasDiagonalesAscendenteIndices.forEach(element =>{
                casillasDiagonalesAscendenteObjeto.push(casillasBoard[element]);
            });
            casillasDiagonalesAscendenteObjeto.push();
            return casillasDiagonalesAscendenteObjeto;
        }
        function DiagonalDescendenteFicha(fichita){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasDiagonales =[];
            let casillaActual = fichita.casillaObjeto;
            let idFichaFila=parseInt(casillaActual.idTablero.split("")[0]);
            let idFichaColumna=casillaActual.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);



            //Primero las de abajo;
            for (let i = 1;  indexLetrasCasilla-i>=0 && idFichaFila+i<=8; i++) {
                casillasDiagonales.push((idFichaFila+i)+letrasTablero[indexLetrasCasilla-i]);                
             }
             for (let i = 1;  indexLetrasCasilla+i<=7 && idFichaFila-i>=1; i++) {
                casillasDiagonales.push((idFichaFila-i)+letrasTablero[indexLetrasCasilla+i]);                
             }
            //console.log(casillasDiagonales)
            return casillasDiagonales;
        }
        function DiagonalAscendenteFicha(fichita){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasDiagonales =[];
            let casillaActual = fichita.casillaObjeto;
            let idFichaFila=parseInt(casillaActual.idTablero.split("")[0]);
            let idFichaColumna=casillaActual.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);

            //console.log(indexLetrasCasilla);

            //Primero las de abajo;
            for (let i = 1;  indexLetrasCasilla+i<=7 && idFichaFila+i<=8; i++) {
                casillasDiagonales.push((idFichaFila+i)+letrasTablero[indexLetrasCasilla+i]);                
             }
             for (let i = 1;  indexLetrasCasilla-i>=0 && idFichaFila-i>=1; i++) {
                casillasDiagonales.push((idFichaFila-i)+letrasTablero[indexLetrasCasilla-i]);                
             }
            //console.log(casillasDiagonales)
            return casillasDiagonales;
        }
       function  casilla_sombrear(casilla_sombrear){
            casilla_sombrear.setInteractive();
            casilla_sombrear.setStrokeStyle(4,0xE6EF2D);

       }
       function  casilla_sombrearColor(casilla_sombrear,color){
        casilla_sombrear.setInteractive();
        casilla_sombrear.setStrokeStyle(4,color);

   }
       function  casilla_dessombrear(casilla_sombrear){
            casilla_sombrear.setInteractive();
            casilla_sombrear.setStrokeStyle(0,0x000000);

   }
        function casillas_sombrear_direcciones(Ficha){
            let fichas_a_colorear=[];
            let fichas_a_colorearDiagonal=[];
            verticalesFicha(Ficha).forEach(element => {
                fichas_a_colorear.push(getCasillaObjetoById(element));
            });
            HorizontalesFicha(Ficha).forEach(element => {
                fichas_a_colorear.push(getCasillaObjetoById(element));
            });
            DiagonalDescendenteFicha(Ficha).forEach(element => {
                fichas_a_colorearDiagonal.push(getCasillaObjetoById(element));
            });
            DiagonalAscendenteFicha(Ficha).forEach(element => {
                fichas_a_colorearDiagonal.push(getCasillaObjetoById(element));
            });
            fichas_a_colorear.forEach(element => {
                casilla_sombrear(casillas[element]);
            });
            fichas_a_colorearDiagonal.forEach(element => {
                casilla_sombrearColor(casillas[element],0x9172AC);
            });
        }
        function casillas_dessombrear_direcciones(Ficha){
            let fichas_a_colorear=[];
            verticalesFicha(Ficha).forEach(element => {
                fichas_a_colorear.push(getCasillaObjetoById(element));
            });
            HorizontalesFicha(Ficha).forEach(element => {
                fichas_a_colorear.push(getCasillaObjetoById(element));
            });
            fichas_a_colorear.forEach(element => {
                casilla_dessombrear(casillas[element]);
            });
        }
        function calcularMovesHorizontales(Ficha){
            let fichasHorizontales =HorizontalesFicha_ObjetoCasillas(Ficha);
            let movesHorizontales =1;
            fichasHorizontales.forEach(element => {
                if(element.tieneFicha){
                    movesHorizontales++;
                }
            });
            return Ficha.movesH=movesHorizontales;            
        }
        function calcularMovesVerticales(Ficha){
            let fichasVerticales =VerticalesFicha_ObjetoCasillas(Ficha);
            let movesVerticales =1;
            fichasVerticales.forEach(element => {
                if(element.tieneFicha){
                    movesVerticales++;
                }
            });
            return Ficha.movesV=movesVerticales;            
        }
        function calcularMovesDiagonalesDescendente(Ficha){
            let fichasDiagonalesDescente =DiagonalesDescenteFicha_ObjetoCasillas(Ficha);
            let movesDiagonalesDescente =1;
            fichasDiagonalesDescente.forEach(element => {
                if(element.tieneFicha){
                    movesDiagonalesDescente++;
                }
            });
            return Ficha.movesD_D=movesDiagonalesDescente;            
        }
        function calcularMovesDiagonalesAscendente(Ficha){
            let fichasDiagonalesAscendente =DiagonalesAscendenteFicha_ObjetoCasillas(Ficha);
            let movesDiagonalesAscendente =1;
            fichasDiagonalesAscendente.forEach(element => {
                if(element.tieneFicha){
                    movesDiagonalesAscendente++;
                }
            });
            return Ficha.movesD_A=movesDiagonalesAscendente;            
        }
        function moveHorizontal(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let casillaActual = Ficha.casillaObjeto;
            let idFichaFila=parseInt(casillaActual.idTablero.split("")[0]);
            let idFichaColumna=casillaActual.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesHorizontales=calcularMovesHorizontales(Ficha);
            let sePuedeMover=true;
            let colorContrario=oppositeColor(Ficha);
            if(movesHorizontales+indexLetrasCasilla<=7){
                for (let i = 1; i < movesHorizontales && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById(idFichaFila+letrasTablero[i+indexLetrasCasilla])].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (casillasBoard[getCasillaObjetoById(idFichaFila+letrasTablero[movesHorizontales+indexLetrasCasilla])].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push(idFichaFila+letrasTablero[movesHorizontales+indexLetrasCasilla]);
                }
            }
            //Second part
            sePuedeMover=true;
            if(indexLetrasCasilla-movesHorizontales>=0){
                for (let i = 1; i < movesHorizontales && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById(idFichaFila+letrasTablero[indexLetrasCasilla-i])].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                
                if (casillasBoard[getCasillaObjetoById(idFichaFila+letrasTablero[indexLetrasCasilla-movesHorizontales])].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                }
                if (sePuedeMover) {
                    casillasToMove.push(idFichaFila+letrasTablero[indexLetrasCasilla-movesHorizontales]);
                }
            }
            
            return casillasToMove;
        }
        function moveVertical(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let casillaActual = Ficha.casillaObjeto;
            let idFichaFila=parseInt(casillaActual.idTablero.split("")[0]);
            let idFichaColumna=casillaActual.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesVerticales=calcularMovesVerticales(Ficha);
            let sePuedeMover=true;
            let colorContrario=oppositeColor(Ficha);
            if(movesVerticales+idFichaFila<=8){
                for (let i = 1; i < movesVerticales && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById((idFichaFila+i)+idFichaColumna)].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (casillasBoard[getCasillaObjetoById((idFichaFila+movesVerticales)+idFichaColumna)].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push((idFichaFila+movesVerticales)+idFichaColumna);
                }
            }
            //Second part
            sePuedeMover=true;
            if(idFichaFila-movesVerticales>0){
                for (let i = 1; i < movesVerticales && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById((idFichaFila-i)+idFichaColumna)].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                
                if (casillasBoard[getCasillaObjetoById((idFichaFila-movesVerticales)+idFichaColumna)].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                }
                if (sePuedeMover) {
                    //console.log((movesVerticales));
                    casillasToMove.push((idFichaFila-movesVerticales)+idFichaColumna);
                }
            }
            
            return casillasToMove;
        }
        function moveDiagonalAscendente(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let casillaActual = Ficha.casillaObjeto;
            let idFichaFila=parseInt(casillaActual.idTablero.split("")[0]);
            let idFichaColumna=casillaActual.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesDiagonalesAscendente=calcularMovesDiagonalesAscendente(Ficha);
            let sePuedeMover=true;
            let colorContrario=oppositeColor(Ficha);
            if(indexLetrasCasilla+movesDiagonalesAscendente<=7 && idFichaFila+movesDiagonalesAscendente<=8){
                for (let i = 1; i < movesDiagonalesAscendente && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById((idFichaFila+i)+letrasTablero[i+indexLetrasCasilla])].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (casillasBoard[getCasillaObjetoById((idFichaFila+movesDiagonalesAscendente)+letrasTablero[indexLetrasCasilla+movesDiagonalesAscendente])].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push((idFichaFila+movesDiagonalesAscendente)+letrasTablero[indexLetrasCasilla+movesDiagonalesAscendente]);
                }
            }
            //Second part
            sePuedeMover=true;
            if(indexLetrasCasilla-movesDiagonalesAscendente>=0 && idFichaFila-movesDiagonalesAscendente>0){
                for (let i = 1; i < movesDiagonalesAscendente && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById((idFichaFila-i)+letrasTablero[indexLetrasCasilla-i])].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (casillasBoard[getCasillaObjetoById((idFichaFila-movesDiagonalesAscendente)+letrasTablero[indexLetrasCasilla-movesDiagonalesAscendente])].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push((idFichaFila-movesDiagonalesAscendente)+letrasTablero[indexLetrasCasilla-movesDiagonalesAscendente]);
                }
            }
            
            return casillasToMove;
        }
        function moveDiagonalDescendente(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let casillaActual = Ficha.casillaObjeto;
            let idFichaFila=parseInt(casillaActual.idTablero.split("")[0]);
            let idFichaColumna=casillaActual.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesDiagonalesDescendente=calcularMovesDiagonalesDescendente(Ficha);
            let sePuedeMover=true;
            let colorContrario=oppositeColor(Ficha);
            if(indexLetrasCasilla-movesDiagonalesDescendente>=0 && idFichaFila+movesDiagonalesDescendente<=8){
                for (let i = 1; i < movesDiagonalesDescendente && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById((idFichaFila+i)+letrasTablero[indexLetrasCasilla-1])].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (casillasBoard[getCasillaObjetoById((idFichaFila+movesDiagonalesDescendente)+letrasTablero[indexLetrasCasilla-movesDiagonalesDescendente])].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push((idFichaFila+movesDiagonalesDescendente)+letrasTablero[indexLetrasCasilla-movesDiagonalesDescendente]);
                }
            }
            //Second part
            sePuedeMover=true;
            if(indexLetrasCasilla+movesDiagonalesDescendente<=7 && idFichaFila-movesDiagonalesDescendente>0){
                for (let i = 1; i < movesDiagonalesDescendente && sePuedeMover; i++) {
                    if(casillasBoard[getCasillaObjetoById((idFichaFila-i)+letrasTablero[indexLetrasCasilla+i])].tieneFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (casillasBoard[getCasillaObjetoById((idFichaFila-movesDiagonalesDescendente)+letrasTablero[indexLetrasCasilla+movesDiagonalesDescendente])].tieneFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push((idFichaFila-movesDiagonalesDescendente)+letrasTablero[indexLetrasCasilla+movesDiagonalesDescendente]);
                }
            }
            
            return casillasToMove;
        }
        function terminarPartidaBlancas(){
            let fichasConectadasCopy = fichasConectadas(fichasBlancas[1]);
                if (fichasConectadasCopy.length==fichasBlancas.length) {
                    alert("Ganan Blancas");
                }
        }
        function terminarPartidaNegras(){
            let fichasConectadasCopy = fichasConectadas(fichasNegras[1]);
                if (fichasConectadasCopy.length==fichasNegras.length) {
                    alert("Ganan Negras");
                }
        }
        function oppositeColor(Ficha){
            let colorContrario;
            if (Ficha.jugador=="blancas") {
                return colorContrario="negras"
            }
            if(Ficha.jugador=="negras"){
                return colorContrario="blancas"
            }
        }
        function moveFicha(Ficha){
            terminarPartidaNegras();
            terminarPartidaBlancas();
            let movesFicha=[];
            moveHorizontal(Ficha).forEach(element => {
                movesFicha.push(element);
            });
            moveVertical(Ficha).forEach(element => {
                movesFicha.push(element);
            });
            moveDiagonalAscendente(Ficha).forEach(element => {
                movesFicha.push(element);
            });
            moveDiagonalDescendente(Ficha).forEach(element => {
                movesFicha.push(element);
            });
            let indexMoves=0;
            casillasHighlighted.forEach(element =>{
                element.destroy();
            });
            movesFicha.forEach(element => {
                let jugador = Ficha.jugador;
                let casillaPintar=casillasBoard[map1.get(element)];
                casillasHighlighted[indexMoves]=gameScene.add.rectangle(casillaPintar.posX,casillaPintar.posY,ladoCasilla,ladoCasilla);
                mapCasillasHighlighted.set(casillasHighlighted[indexMoves],casillaPintar.id);
                casillasHighlighted[indexMoves].setStrokeStyle(4, 0x9172AC);
                casillasHighlighted[indexMoves].setInteractive().on('pointerup',function(){
                    if (Ficha!=null) {
                        Ficha.fichaCanvas.destroy();
                        Ficha.casillaObjeto.tieneFicha=false;
                        Ficha.casilla=null;
                        Ficha=null;
                    }
                    if (casillasBoard[mapCasillasHighlighted.get(this)].tieneFicha) {
                        //console.log("You killed an enemy");
                        //console.log(fichasNegras);
                        //console.log(fichasBlancas);
                        getFichaByCasillasBoard(casillasBoard[mapCasillasHighlighted.get(this)]);
                    }
                    Ficha=new fichaTablero(casillas[mapCasillasHighlighted.get(this)],jugador,gameScene,casillasBoard[mapCasillasHighlighted.get(this)]);
                    if (jugador=="blancas") {
                        fichasBlancas.push(Ficha);
                        turnoPartida=false;
                    }
                    if (jugador=="negras") {
                        fichasNegras.push(Ficha);
                        turnoPartida=true;
                    }
                    reciclar(fichasNegras);
                    reciclar(fichasBlancas);
                    //Ficha=new fichaTablero(casillas[mapCasillasHighlighted.get(this)],jugador,gameScene,casillasBoard[mapCasillasHighlighted.get(this)]);
                    fichaSeleccionada.setStrokeStyle(0,0x000000);
                    casillasHighlighted.forEach(element =>{
                        element.destroy();
                    });
                    terminarPartidaNegras();
                    terminarPartidaBlancas();
                });
                // posiblesMoves[indexMoves].setInteractive().on('pointerup',function(){
                //     Ficha.casillaObjeto.tieneFicha=false;
                //     Ficha.fichaCanvas.destroy();
                //     Ficha.fichaCanvas=gameScene.add.circle(casillaPintar.posX, casillaPintar.posY, 40, colorFichasNegras).setInteractive();
                //     Ficha = new fichaTablero(casillas[map1.get(element)],"negras",gameScene,casillasBoard[map1.get(element)]);
                //     //myFichaPrueba.fichaCanvas=gameScene.add.circle(casillaPintar.posX, casillaPintar.posY, 40, colorFichasNegras).setInteractive();
                //     posiblesMoves.forEach(element => {
                //         element.setStrokeStyle(0,0x9172AC);
                //         //gameScene.remove.circle(casillaPintar.posX, casillaPintar.posY, 40, colorFichasBlancas);
                //         //gameScene.destroy(myFichaPrueba.fichaCanvas);
                //     });
                // });
                indexMoves++;
               });
            //    terminarPartidaNegras();
            //    terminarPartidaBlancas();

            return movesFicha;

        }
        function movilityFicha(Ficha){
            Ficha.fichaCanvas.setInteractive();

        }
        function reciclar(fichasArray){
            for (let index = 0; index < fichasArray.length; index++) {
                if (fichasArray[index].casilla==null) {
                    fichasArray.splice(index,1);
                }
                
            }
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
    let indexPrueba =map1.get("4e");
    let posiblesMoves=[];
    let indexMoves=0;
    let activated=false;
    // let myFichaPrueba = new fichaTablero(casillas[indexPrueba],"negras",this,casillasBoard[indexPrueba]);
    // myFichaPrueba.fichaCanvas.on('pointerup', function() {
       

       
    //     moveFicha(myFichaPrueba).forEach(element => {
           
    //         let casillaPintar=casillasBoard[map1.get(element)];
    //         casillasHighlighted[indexMoves]=gameScene.add.rectangle(casillaPintar.posX,casillaPintar.posY,ladoCasilla,ladoCasilla);
    //         casillasHighlighted[indexMoves].setStrokeStyle(4, 0x9172AC);
    //         casillasHighlighted[indexMoves].setInteractive().on('pointerup',function(){
    //             myFichaPrueba.casillaObjeto.tieneFicha=false;
    //             myFichaPrueba.fichaCanvas.destroy();
    //             myFichaPrueba.fichaCanvas=gameScene.add.circle(casillaPintar.posX, casillaPintar.posY, 40, colorFichasNegras).setInteractive();
    //             myFichaPrueba = new fichaTablero(casillas[map1.get(element)],"negras",gameScene,casillasBoard[map1.get(element)]);
    //             //myFichaPrueba.fichaCanvas=gameScene.add.circle(casillaPintar.posX, casillaPintar.posY, 40, colorFichasNegras).setInteractive();
    //             console.log("Die, die");

    //         });
    //         indexMoves++;
    //        });
           

    //    //console.log(moveDiagonalDescendente(myFichaPrueba));

    //    //casilla_sombrear(casillas[getCasillaObjetoById(moveHorizontal(myFichaPrueba))]);
    //    //casillas_sombrear_direcciones(myFichaPrueba);
    //      });
       let a = gameScene.add.rectangle(900,900,ladoCasilla,ladoCasilla,0x9172AC).setInteractive();
       a.on('pointerup',function() {
           //a.destroy();
           casillasHighlighted.forEach(element =>{
               element.destroy();
           });
              console.log(turnoPartida);
        //    console.log("Negras: "+fichasNegras.length);
        //    console.log("Blancas: "+fichasBlancas.length);
       });
}