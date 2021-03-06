

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1200,
    physics: {
        
        default: 'arcade',

    },
    backgroundColor: '#789651',
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
let casillaSeleccionada=null;
let logMovimientos=[];
let fichasNegras = [];
let identificadoresTablero=[];
let turnoPartida=false;
let partidaAcabada=false;
let defaultBoard=true;
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
const jugadorVSjugador = false;

let mapBaseDeDatos = new Map();

function preload ()
{
    //this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('refresh', 'assets/refresh-svgrepo-com.svg');
    this.load.image('backwards', 'assets/backward-svgrepo-com.svg');
    //this.load.image('red', 'assets/particles/red.png');
}

function create ()
{   
    class MovementLog{
        constructor(ficha,casilla_inicial,casilla_to,ficha_comida){
            this.ficha=ficha;
            this.casilla_inicial=casilla_inicial;
            this.casilla_to=casilla_to;
            this.ficha_comida=ficha_comida;
        }
    }
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
                if (turnoPartida==true && jugador=="blancas" && partidaAcabada==false && jugadorVSjugador) {
                    if (fichaSeleccionada!=null) {
                        fichaSeleccionada.setStrokeStyle(0,0x000000);
                    }
                    if (casillaSeleccionada!=null) {
                        casillaSeleccionada.setStrokeStyle(0,0x000000)
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
                    if (casillaSeleccionada!=null) {
                        casillaSeleccionada.setStrokeStyle(0,0x000000)
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
      class MovementFichaFic {
          constructor(FichaFic,casilla){
              this.FichaFic= FichaFic;
              this.casillaFicha=FichaFic.idTablero;
              this.to_casilla=casilla;
          }
      }
      class TableroFic{
        
        constructor(){
            this.centroDeMasaNegras= new CentroDeMasas();
            this.centroDeMasaBlancas= new CentroDeMasas();
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            this.mapMoves= new Map();
            this.mapMovePrimigenio= new Map();
            this.casillasTablero=[];
            this.fichasBlancas=[];
            this.fichasNegras=[];
            this.turno;
            this.profundidad;
            let fichaLimite=false;
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
                            this.casillasTablero[fila*8+i]= new CasillaFic(colorBlancasTablero,false,fila*8+i,identificadoresTablero[fila*8+i]);
                        }
                        else
                            this.casillasTablero[fila*8+i]= new CasillaFic(colorNegrasTablero,false,fila*8+i,identificadoresTablero[fila*8+i]);
                        //casillas[i].setOrigin(0,0);
                        // console.log(casillas[i]);
                    }
                    else
                        if (i%2==0) {
                            //Esto es PAR
                            this.casillasTablero[fila*8+i]= new CasillaFic(colorNegrasTablero,false,fila*8+i,identificadoresTablero[fila*8+i]);
                        }
                        else
                            this.casillasTablero[fila*8+i]= new CasillaFic(colorBlancasTablero,false,fila*8+i,identificadoresTablero[fila*8+i]);
                        //casillas[i].setOrigin(0,0);
                        // console.log(casillas[i]);
                 }
                
            }
            const numFilas=8;
            const numColumnas=8;
            for (let i = 0; i < numFilas; i++) {
                for (let j = 0; j < numColumnas; j++) {
                    if (i==0 || i == numFilas-1 || j==0 || j==numColumnas-1) {
                        this.casillasTablero[(i*8)+j].CasillaLimite=true;
                    }
                }               
            }


        }
        oppositeColor(Ficha){
            let colorContrario;
            if (Ficha.jugador=="blancas") {
                return colorContrario="negras"
            }
            if(Ficha.jugador=="negras"){
                return colorContrario="blancas"
            }
        }


        HorizontalesFicha(fichita){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasHorizontales =[];
            let idFichaFila=fichita.idTablero.split("")[0];
            let idFichaColumna=fichita.idTablero.split("")[1];
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
        VerticalesFicha(fichita){
            let casillasVerticales =[];
            let idFichaFila=parseInt(fichita.idTablero.split("")[0]);
            let idFichaColumna=fichita.idTablero.split("")[1];

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
        DiagonalDescendenteFicha(fichita){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasDiagonales =[];
            let idFichaFila=parseInt(fichita.idTablero.split("")[0]);
            let idFichaColumna=fichita.idTablero.split("")[1];
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
        DiagonalAscendenteFicha(fichita){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasDiagonales =[];
            let idFichaFila=parseInt(fichita.idTablero.split("")[0]);
            let idFichaColumna=fichita.idTablero.split("")[1];
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



        HorizontalesFicha_ObjetoCasillas(ficha){
            let casillasHorizontales=this.HorizontalesFicha(ficha);
            let casillasHorizontalesIndices=[];
            let casillasHorizontalesObjeto=[];
            casillasHorizontales.forEach(element => {
                casillasHorizontalesIndices.push(map1.get(element));
            });
            casillasHorizontalesIndices.forEach(element =>{
                casillasHorizontalesObjeto.push(this.casillasTablero[element]);
            });
            casillasHorizontalesObjeto.push();
            return casillasHorizontalesObjeto;
        }
        VerticalesFicha_ObjetoCasillas(ficha){
            let casillasVerticales=this.VerticalesFicha(ficha);
            let casillasVerticalesIndices=[];
            let casillasVerticalesObjeto=[];
            casillasVerticales.forEach(element => {
                casillasVerticalesIndices.push(map1.get(element));
            });
            casillasVerticalesIndices.forEach(element =>{
                casillasVerticalesObjeto.push(this.casillasTablero[element]);
            });
            casillasVerticalesObjeto.push();
            return casillasVerticalesObjeto;
        }
        DiagonalesDescenteFicha_ObjetoCasillas(ficha){
            let casillasDiagonalesDescente=this.DiagonalDescendenteFicha(ficha);
            let casillasDiagonalesDescenteIndices=[];
            let casillasDiagonalesDescenteObjeto=[];
            casillasDiagonalesDescente.forEach(element => {
                casillasDiagonalesDescenteIndices.push(map1.get(element));
            });
            casillasDiagonalesDescenteIndices.forEach(element =>{
                casillasDiagonalesDescenteObjeto.push(this.casillasTablero[element]);
            });
            casillasDiagonalesDescenteObjeto.push();
            return casillasDiagonalesDescenteObjeto;
        }
        DiagonalesAscendenteFicha_ObjetoCasillas(ficha){
            let casillasDiagonalesAscendente=this.DiagonalAscendenteFicha(ficha);
            let casillasDiagonalesAscendenteIndices=[];
            let casillasDiagonalesAscendenteObjeto=[];
            casillasDiagonalesAscendente.forEach(element => {
                casillasDiagonalesAscendenteIndices.push(map1.get(element));
            });
            casillasDiagonalesAscendenteIndices.forEach(element =>{
                casillasDiagonalesAscendenteObjeto.push(this.casillasTablero[element]);
            });
            casillasDiagonalesAscendenteObjeto.push();
            return casillasDiagonalesAscendenteObjeto;
        }




        calcularMovesVerticales(Ficha){
            let fichasVerticales =this.VerticalesFicha_ObjetoCasillas(Ficha);
            let movesVerticales =1;
            fichasVerticales.forEach(element => {
                if(element.tieneFicha){
                    movesVerticales++;
                }
            });
            return Ficha.movesV=movesVerticales;            
        }
        calcularMovesHorizontales(Ficha){
            let fichasHorizontales =this.HorizontalesFicha_ObjetoCasillas(Ficha);
            let movesHorizontales =1;
            fichasHorizontales.forEach(element => {
                if(element.tieneFicha){
                    movesHorizontales++;
                }
            });
            return Ficha.movesH=movesHorizontales;            
        }
        calcularMovesDiagonalesDescendente(Ficha){
            let fichasDiagonalesDescente =this.DiagonalesDescenteFicha_ObjetoCasillas(Ficha);
            let movesDiagonalesDescente =1;
            fichasDiagonalesDescente.forEach(element => {
                if(element.tieneFicha){
                    movesDiagonalesDescente++;
                }
            });
            return Ficha.movesD_D=movesDiagonalesDescente;            
        }
        calcularMovesDiagonalesAscendente(Ficha){
            let fichasDiagonalesAscendente =this.DiagonalesAscendenteFicha_ObjetoCasillas(Ficha);
            let movesDiagonalesAscendente =1;
            fichasDiagonalesAscendente.forEach(element => {
                if(element.tieneFicha){
                    movesDiagonalesAscendente++;
                }
            });
            return Ficha.movesD_A=movesDiagonalesAscendente;            
        }



        moveVertical(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let casillaActual = Ficha.casillaObjeto;
            let idFichaFila=parseInt(Ficha.idTablero.split("")[0]);
            let idFichaColumna=Ficha.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesVerticales=this.calcularMovesVerticales(Ficha);
            let sePuedeMover=true;
            let colorContrario=this.oppositeColor(Ficha);
            if(movesVerticales+idFichaFila<=8){
                for (let i = 1; i < movesVerticales && sePuedeMover; i++) {
                    if(this.casillasTablero[map1.get((idFichaFila+i)+idFichaColumna)].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (this.casillasTablero[map1.get((idFichaFila+movesVerticales)+idFichaColumna)].colorFicha==Ficha.jugador) {
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
                    if(this.casillasTablero[map1.get((idFichaFila-i)+idFichaColumna)].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                
                if (this.casillasTablero[map1.get((idFichaFila-movesVerticales)+idFichaColumna)].colorFicha==Ficha.jugador) {
                    sePuedeMover=false;
                }
                if (sePuedeMover) {
                    //console.log((movesVerticales));
                    casillasToMove.push((idFichaFila-movesVerticales)+idFichaColumna);
                }
            }
            
            return casillasToMove;
        }
        moveHorizontal(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let idFichaFila=parseInt(Ficha.idTablero.split("")[0]);
            let idFichaColumna=Ficha.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesHorizontales=this.calcularMovesHorizontales(Ficha);
            let sePuedeMover=true;
            let colorContrario=this.oppositeColor(Ficha);
            if(movesHorizontales+indexLetrasCasilla<=7){
                for (let i = 1; i < movesHorizontales && sePuedeMover; i++) {
                    if(this.casillasTablero[map1.get(idFichaFila+letrasTablero[i+indexLetrasCasilla])].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (this.casillasTablero[map1.get(idFichaFila+letrasTablero[movesHorizontales+indexLetrasCasilla])].colorFicha==Ficha.jugador) {
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
                    if(this.casillasTablero[map1.get(idFichaFila+letrasTablero[indexLetrasCasilla-i])].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                
                if (this.casillasTablero[map1.get(idFichaFila+letrasTablero[indexLetrasCasilla-movesHorizontales])].colorFicha==Ficha.jugador) {
                    sePuedeMover=false;
                }
                if (sePuedeMover) {
                    casillasToMove.push(idFichaFila+letrasTablero[indexLetrasCasilla-movesHorizontales]);
                }
            }
            
            return casillasToMove;
        }
        moveDiagonalAscendente(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let idFichaFila=parseInt(Ficha.idTablero.split("")[0]);
            let idFichaColumna=Ficha.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesDiagonalesAscendente=this.calcularMovesDiagonalesAscendente(Ficha);
            let sePuedeMover=true;
            let colorContrario=this.oppositeColor(Ficha);
            if(indexLetrasCasilla+movesDiagonalesAscendente<=7 && idFichaFila+movesDiagonalesAscendente<=8){
                for (let i = 1; i < movesDiagonalesAscendente && sePuedeMover; i++) {
                    if(this.casillasTablero[map1.get((idFichaFila+i)+letrasTablero[i+indexLetrasCasilla])].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (this.casillasTablero[map1.get((idFichaFila+movesDiagonalesAscendente)+letrasTablero[indexLetrasCasilla+movesDiagonalesAscendente])].colorFicha==Ficha.jugador) {
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
                    if(this.casillasTablero[map1.get((idFichaFila-i)+letrasTablero[indexLetrasCasilla-i])].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (this.casillasTablero[map1.get((idFichaFila-movesDiagonalesAscendente)+letrasTablero[indexLetrasCasilla-movesDiagonalesAscendente])].colorFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push((idFichaFila-movesDiagonalesAscendente)+letrasTablero[indexLetrasCasilla-movesDiagonalesAscendente]);
                }
            }
            
            return casillasToMove;
        }
        moveDiagonalDescendente(Ficha){
            const letrasTablero=["a","b","c","d","e","f","g","h"];
            let casillasToMove=[];
            let casillaActual = Ficha.casillaObjeto;
            let idFichaFila=parseInt(Ficha.idTablero.split("")[0]);
            let idFichaColumna=Ficha.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            let movesDiagonalesDescendente=this.calcularMovesDiagonalesDescendente(Ficha);
            let sePuedeMover=true;
            let colorContrario=this.oppositeColor(Ficha);
            if(indexLetrasCasilla-movesDiagonalesDescendente>=0 && idFichaFila+movesDiagonalesDescendente<=8){
                for (let i = 1; i < movesDiagonalesDescendente && sePuedeMover; i++) {
                    if(this.casillasTablero[map1.get((idFichaFila+i)+letrasTablero[indexLetrasCasilla-i])].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (this.casillasTablero[map1.get((idFichaFila+movesDiagonalesDescendente)+letrasTablero[indexLetrasCasilla-movesDiagonalesDescendente])].colorFicha==Ficha.jugador) {
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
                    if(this.casillasTablero[map1.get((idFichaFila-i)+letrasTablero[indexLetrasCasilla+i])].colorFicha==colorContrario){
                        sePuedeMover=false;
                    }                   
                    
                }
                if (this.casillasTablero[map1.get((idFichaFila-movesDiagonalesDescendente)+letrasTablero[indexLetrasCasilla+movesDiagonalesDescendente])].colorFicha==Ficha.jugador) {
                    sePuedeMover=false;
                    
                }
                if (sePuedeMover) {
                    casillasToMove.push((idFichaFila-movesDiagonalesDescendente)+letrasTablero[indexLetrasCasilla+movesDiagonalesDescendente]);
                }
            }
            
            return casillasToMove;
        }



        moves_Ficha_Func(Ficha){
            let moves_for_ficha=[];
            this.moveHorizontal(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            this.moveVertical(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            this.moveDiagonalAscendente(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            this.moveDiagonalDescendente(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            return moves_for_ficha;

        }


        distanciaFichaCentroMasas(Ficha,centroDeMasas){
            let posX = parseInt(Ficha.idTablero.split("")[0]);
            let posY = letrasTablero.indexOf(Ficha.idTablero[1])+1;
            let distance=0;
            if (posX == centroDeMasas.posX) {
               return  distance = Math.abs(posY-centroDeMasas.posY);
            }
            if (posY == centroDeMasas.posY) {

               return  distance = Math.abs(posX-centroDeMasas.posX);
            }
            if (Math.abs(posX-centroDeMasas.posX)<=Math.abs(posY-centroDeMasas.posY)) {
                distance=Math.abs(posX-centroDeMasas.posX);
                if (posY-centroDeMasas.posY>=0) {
                    return distance+=Math.abs(posY-centroDeMasas.posY)-distance
                }
                if (posY-centroDeMasas.posY<0) {

                    return distance+=Math.abs(posY-centroDeMasas.posY)-distance
                }
            }
            if (Math.abs(posY-centroDeMasas.posY)<=Math.abs(posX-centroDeMasas.posX)) {
                distance=Math.abs(posY-centroDeMasas.posY);
                if (posX-centroDeMasas.posX>=0) {

                    return distance+=Math.abs(posX-centroDeMasas.posX)-distance
                }
                if (posX-centroDeMasas.posX<0) {
                   return distance+=Math.abs(posX-centroDeMasas.posX)-distance
                }
            }

            return distance;
        
        }
        centroDeMasasBlancasFunc(){
            let SumPosX=0;
            let SumPosY=0;

            for (let i = 0; i < this.fichasBlancas.length; i++) {
                    SumPosX+=parseInt(this.fichasBlancas[i].idTablero.split("")[0]);
                    SumPosY+=letrasTablero.indexOf(this.fichasBlancas[i].idTablero[1])+1;                
            }
            this.centroDeMasaBlancas.posX=Number((SumPosX/this.fichasBlancas.length).toFixed(0));
            this.centroDeMasaBlancas.posY=Number((SumPosX/this.fichasBlancas.length).toFixed(0));
            return this.centroDeMasaBlancas;
        }
        centroDeMasasNegrasFunc(){
            let SumPosX=0;
            let SumPosY=0;

            for (let i = 0; i < this.fichasNegras.length; i++) {
                    SumPosX+=parseInt(this.fichasNegras[i].idTablero.split("")[0]);
                    SumPosY+=letrasTablero.indexOf(this.fichasNegras[i].idTablero[1])+1;                
            }
            this.centroDeMasaNegras.posX=Number((SumPosX/this.fichasNegras.length).toFixed(0));
            this.centroDeMasaNegras.posY=Number((SumPosX/this.fichasNegras.length).toFixed(0));
            return this.centroDeMasaNegras;
        }
        distanciaMediaEquipoBlancas(){
            let distanceMediaEquipo=0;
            this.centroDeMasasBlancasFunc();
            for (let i = 0; i < this.fichasBlancas.length; i++) {
                distanceMediaEquipo += this.distanciaFichaCentroMasas(this.fichasBlancas[i],this.centroDeMasaBlancas);
            }
            return distanceMediaEquipo/this.fichasBlancas.length;
        }
        distanciaMediaEquipoNegras(){
            let distanceMediaEquipo=0;
            this.centroDeMasasNegrasFunc();
            for (let i = 0; i < this.fichasNegras.length; i++) {
                distanceMediaEquipo += this.distanciaFichaCentroMasas(this.fichasNegras[i],this.centroDeMasaNegras);
            }
            return distanceMediaEquipo/this.fichasNegras.length;
        }
        concentracionBlancas(){
            
            let concentracionBlancas=this.distanciaMediaEquipoBlancas();

            return 1/concentracionBlancas;

        }
        concentracionNegras(){
                        
            let concentracionBlancas=this.distanciaMediaEquipoNegras();

            return 1/concentracionBlancas;
            
        }
        distancia_centrTablero_CdM_Blancas(){
            this.centroDeMasasBlancasFunc();
            let centroTablero = new CentroDeMasas();
            centroTablero.posX=4.5;
            centroTablero.posY=4.5
            let val_x;
            let val_y;
            val_x=centroTablero.posX-Math.pow((centroTablero.posX-this.centroDeMasaBlancas.posX),2);
            val_y=centroTablero.posY-Math.pow((centroTablero.posY-this.centroDeMasaBlancas.posY),2);

            return val_x+val_y;
        }
        distancia_centrTablero_CdM_Negras(){
        this.centroDeMasasNegrasFunc();
        let centroTablero = new CentroDeMasas();
        centroTablero.posX=4.5;
        centroTablero.posY=4.5
        let val_x;
        let val_y;
        val_x=centroTablero.posX-Math.pow((centroTablero.posX-this.centroDeMasaNegras.posX),2);
        val_y=centroTablero.posY-Math.pow((centroTablero.posY-this.centroDeMasaNegras.posY),2);

        return val_x+val_y;
        }
        fichasEnBordeNegras(){
            let fichasEnBordeNegras=0;
            for (let i = 0; i < this.fichasNegras.length; i++) {
                if(this.casillasTablero[this.fichasNegras[i].idNum].CasillaLimite){
                    fichasEnBordeNegras++;
                }
                
            }
            return fichasEnBordeNegras;
        }
        fichasEnBordeBlancas(){
            let fichasEnBordeBlancas=0;
            for (let i = 0; i < this.fichasBlancas.length; i++) {
                if(this.casillasTablero[this.fichasBlancas[i].idNum].CasillaLimite){
                    fichasEnBordeBlancas++;
                }
                
            }
            return fichasEnBordeBlancas;
        }


        next_move_Negras_TableroFic(Ficha,casilla,TableroFic){
            TableroFic.turno="blancas"
            TableroFic.profundidad=this.profundidad+1;
            TableroFic.mapMovePrimigenio=this.mapMovePrimigenio;
            TableroFic.mapMoves.set(Ficha,casilla);
            this.fichasNegras.forEach(element => {
                if(element===Ficha){
                    TableroFic.fichasNegras.push(new FichaFic(element.jugador,casilla,map1.get(casilla)));
                    TableroFic.casillasTablero[map1.get(casilla)].tieneFicha=true;
                    TableroFic.casillasTablero[map1.get(casilla)].colorFicha="negras";
                }
                else{
                    TableroFic.fichasNegras.push(new FichaFic(element.jugador,element.idTablero,element.idNum));
                    TableroFic.casillasTablero[element.idNum].tieneFicha=true;
                    TableroFic.casillasTablero[element.idNum].colorFicha="negras";
                }
    
            });
            for (let i = 0; i < this.fichasBlancas.length; i++) {
                if(this.fichasBlancas[i].idTablero==casilla){
                }
                else{
                    TableroFic.fichasBlancas.push(new FichaFic(this.fichasBlancas[i].jugador,this.fichasBlancas[i].idTablero,this.fichasBlancas[i].idNum));
                    TableroFic.casillasTablero[this.fichasBlancas[i].idNum].tieneFicha=true;
                    TableroFic.casillasTablero[this.fichasBlancas[i].idNum].colorFicha="blancas";
    
                }
               
           }
        }
        next_move_Blancas_TableroFic(Ficha,casilla,TableroFic){
            TableroFic.turno="negras"
            TableroFic.profundidad=this.profundidad+1;
            TableroFic.mapMovePrimigenio=this.mapMovePrimigenio;
            TableroFic.mapMoves.set(Ficha,casilla);
            this.fichasBlancas.forEach(element => {
                if(element===Ficha){
                    TableroFic.fichasBlancas.push(new FichaFic(element.jugador,casilla,map1.get(casilla)));
                    TableroFic.casillasTablero[map1.get(casilla)].tieneFicha=true;
                    TableroFic.casillasTablero[map1.get(casilla)].colorFicha="blancas";
                }
                else{
                    TableroFic.fichasBlancas.push(new FichaFic(element.jugador,element.idTablero,element.idNum));
                    TableroFic.casillasTablero[element.idNum].tieneFicha=true;
                    TableroFic.casillasTablero[element.idNum].colorFicha="blancas";
                }
    
            });
            for (let i = 0; i < this.fichasNegras.length; i++) {
                if(this.fichasNegras[i].idTablero==casilla){
                }
                else{

                    TableroFic.fichasNegras.push(new FichaFic(this.fichasNegras[i].jugador,this.fichasNegras[i].idTablero,this.fichasNegras[i].idNum));
                    TableroFic.casillasTablero[this.fichasNegras[i].idNum].tieneFicha=true;
                    TableroFic.casillasTablero[this.fichasNegras[i].idNum].colorFicha="negras";
    
                }
               
           }
        }
        all_next_moves_TableroFic(){
            if (this.turno=="blancas") {
                let arrayTablerosFicBlancas=[];
                //console.log("Se van a procesar todos los movimientos para las BLANCAS");
                for (let j = 0,contador=0; j < this.fichasBlancas.length; j++) {
                    for (let i = 0; i < this.moves_Ficha_Func(this.fichasBlancas[j]).length; i++) {
                        arrayTablerosFicBlancas.push(new TableroFic());
                        this.next_move_Blancas_TableroFic(this.fichasBlancas[j],this.moves_Ficha_Func(this.fichasBlancas[j])[i],arrayTablerosFicBlancas[contador]);
                        contador++;
                    }
               }
               return arrayTablerosFicBlancas;
            }
            else{
                let arrayTablerosFicNegras=[];
                //console.log("Se van a procesar todos los movimientos para las NEGRAS");
                for (let j = 0,contador=0; j < this.fichasNegras.length; j++) {
                    for (let i = 0; i < this.moves_Ficha_Func(this.fichasNegras[j]).length; i++) {
                        arrayTablerosFicNegras.push(new TableroFic());
                        this.next_move_Negras_TableroFic(this.fichasNegras[j],this.moves_Ficha_Func(this.fichasNegras[j])[i],arrayTablerosFicNegras[contador]);
                        contador++;
                    }
               }
               return arrayTablerosFicNegras;
            }
        }

    

        getFichaByIdBoard(idTablero1){

            for (let i = 0; i < this.fichasNegras.length; i++) {
                if (""+this.fichasNegras[i].idTablero===""+idTablero1){
                    return this.fichasNegras[i];//return element
                }
                
            }
            for (let i = 0; i < this.fichasBlancas.length; i++) {
                if (""+this.fichasBlancas[i].idTablero===""+idTablero1){
                    return this.fichasBlancas[i];//return element
                }
                
            }
        }

        fichasDeAlrededor(Ficha){
            let fichasDeAlrededor=[];
            let idFichaFila=parseInt(Ficha.idTablero.split("")[0]);
            let idFichaColumna=Ficha.idTablero.split("")[1];
            let indexLetrasCasilla=letrasTablero.indexOf(idFichaColumna);
            //Para las horizontales
            this.HorizontalesFicha(Ficha).forEach(element =>{
                if (element==idFichaFila+(letrasTablero[indexLetrasCasilla-1])) {
                    fichasDeAlrededor.push(element);
                }
                if (element==idFichaFila+(letrasTablero[indexLetrasCasilla+1])) {
                    fichasDeAlrededor.push(element);
                }
            });
            this.VerticalesFicha(Ficha).forEach(element =>{
                if (element==(idFichaFila-1)+letrasTablero[indexLetrasCasilla]) {
                    fichasDeAlrededor.push(element);
                }
                if (element==(idFichaFila+1)+letrasTablero[indexLetrasCasilla]) {
                    fichasDeAlrededor.push(element);
                }
            });
            this.DiagonalDescendenteFicha(Ficha).forEach(element =>{
                if (element==(idFichaFila+1)+letrasTablero[indexLetrasCasilla-1]) {
                    fichasDeAlrededor.push(element);
                }
                if (element==(idFichaFila-1)+letrasTablero[indexLetrasCasilla+1]) {
                    fichasDeAlrededor.push(element);
                }
            });
            this.DiagonalAscendenteFicha(Ficha).forEach(element =>{
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


        fichasConectadas(Ficha){
            //getFichaByCasilla();
            let fichasConectadas =[];
            fichasConectadas.push(Ficha.idTablero);
            this.fichasConectadasRec(Ficha,Ficha.idTablero,fichasConectadas);
            return fichasConectadas;
        }
        fichasConectadasRec(Ficha,idTablero,fichasConectadas){
            this.fichasDeAlrededor(Ficha).forEach(element => {
                if(this.casillasTablero[map1.get(element)].colorFicha==Ficha.jugador && !fichasConectadas.includes(element) ){
                    fichasConectadas.push(element);
                    this.fichasConectadasRec(this.getFichaByIdBoard(element),element,fichasConectadas);
                }
                return fichasConectadas;
            });
            return fichasConectadas;
        }
         fichasAisladasNegras(){
            let fichasAisladas = [];
            this.fichasNegras.forEach( element =>{
                //console.log(fichasConectadas(element));
                if (this.fichasConectadas(element).length == 1) {
                    fichasAisladas.push(element);
                }
            });
            return fichasAisladas;
        }
        
         fichasAisladasBlancas(){
            let fichasAisladas = [];
            this.fichasBlancas.forEach( element =>{
                if (this.fichasConectadas(element).length == 1) {
                    fichasAisladas.push(element);
                }
            });
            return fichasAisladas;
        }
        
         puntuacionFichasAisladasNegras(){
            let puntuacion=0;
            let fichasAisladas=this.fichasAisladasNegras();
            fichasAisladas.forEach(element =>{
                let nextMovesFicha=this.moves_Ficha_Func(element).length
                if (nextMovesFicha==0) {
                    puntuacion+=1000;
                }
                else{
                    puntuacion+=(50/(nextMovesFicha*2));
                }
            });
            return puntuacion;
        }
         puntuacionFichasAisladasBlancas(){
            let puntuacion=0;
            let fichasAisladas=this.fichasAisladasBlancas();
            fichasAisladas.forEach(element =>{
                let nextMovesFicha=this.moves_Ficha_Func(element).length
                if (nextMovesFicha==0) {
                    puntuacion+=1000;
                }
                else{
                    puntuacion+=(50/(nextMovesFicha*2));
                }
            });
            return puntuacion;

        }

        gananNegras(){

            let fichasConectadasCopy = this.fichasConectadas(this.fichasNegras[0]);

            if (fichasConectadasCopy.length==this.fichasNegras.length) {
                

                return Number.NEGATIVE_INFINITY;
            }
            else{
                return 0;
            }
        }
        gananBlancas(){
            let fichasConectadasCopy = this.fichasConectadas(this.fichasBlancas[0]);
            if (fichasConectadasCopy.length==this.fichasBlancas.length) {
                return Number.POSITIVE_INFINITY;
            }
            else{
                return 0;
            }
        }
        funcEval(){
           
            let negrasGanan= this.gananNegras();
            let blancasGanan= this.gananBlancas();

            let arrayPesos=[1000,20,1];
            let peso=arrayPesos[0]*(this.concentracionBlancas()
            -this.concentracionNegras())+arrayPesos[1]*(-4*this.fichasEnBordeBlancas()
            -this.fichasEnBordeNegras())+this.distancia_centrTablero_CdM_Blancas()
            -10*this.fichasAisladasBlancas().length + 10*this.fichasAisladasNegras().length
            -this.puntuacionFichasAisladasBlancas() + this.puntuacionFichasAisladasNegras()
            -this.distancia_centrTablero_CdM_Negras()+Math.random()
            + negrasGanan +blancasGanan ;
            
            return peso;
        } 
    }
    class CasillaFic{
        constructor(color,tieneFicha,id,idTablero) {
            this.color=color;
            this.tieneFicha=tieneFicha;
            this.id=id;
            this.idTablero=idTablero;
            this.CasillaLimite=false;
            this.Ficha;  
       } 
    }
    class FichaFic{
        constructor(jugador,idTablero,idNum){
            this.jugador=jugador;
            this.idTablero=idTablero;
            this.idNum=idNum;
            this.colorFicha;

        }
    }
      class CentroDeMasas{
        constructor(){
            this.posX=0;
            this.posY=0;
        }
    }
    function conversorTableroFic(TableroFic){
        fichasBlancas.forEach(element => {
            TableroFic.fichasBlancas.push(new FichaFic(element.jugador,element.casillaObjeto.idTablero,element.casillaObjeto.id));
            TableroFic.casillasTablero[element.casillaObjeto.id].tieneFicha=true;
        });
        fichasNegras.forEach(element => {
            TableroFic.fichasNegras.push(new FichaFic(element.jugador,element.casillaObjeto.idTablero,element.casillaObjeto.id));
            TableroFic.casillasTablero[element.casillaObjeto.id].tieneFicha=true;
        });
        return TableroFic;
    }
    let centroTablero = new CentroDeMasas();
    centroTablero.posX=4.5;
    centroTablero.posY=4.5
    let escena=this; 
   //this.add.image(400, 300, 'sky');
   //scene.input.enabled = enabled; // enabled: true/false

   var logo = this.physics.add.image(400, 100, 'logo');

    //logo.setVelocity(100, 200);
    //logo.setBounce(1, 1);
    //logo.setCollideWorldBounds(true);
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
        let centroDeMasaNegras= new CentroDeMasas();
        let centroDeMasaBlancas= new CentroDeMasas();
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
            if(defaultBoard){
                let i=0;
                var positionX;
                var positionY;
                //Primera fila
                for (let index = 1; index < 7; index++) {
                    positionX=casillasBoard[index].posX;
                    positionY=casillasBoard[index].posY;

                    //A??adimos la fichita
                    fichasNegras[i]=new fichaTablero(casillas[index],"negras",escena,casillasBoard[index]);
                    i++;
                }
                //Ultima fila
                for (let index = 1; index < 7; index++) {
                    positionX=casillasBoard[index+56].posX;
                    positionY=casillasBoard[index+56].posY;

                    //A??adimos la fichita
                    fichasNegras[i]=new fichaTablero(casillas[index+56],"negras",escena,casillasBoard[index+56]);;
                    i++;
                }
            }
            else{
                let arrayNegras=["6c","3c","4d","6e","5f"];
                //let arrayNegrasEstrategiaEncontrarMovimientoGanador=["8b","8d","8e","5d","5f","5g","4g","3g","3h","1c","1d"];
                //let arrayNegrasMenosEsMas=["2c","2e"];
                //let arrayNegrasBloqueoEstrategia=["1c","1g","2g","3g","3h","4d","5f","6e"];
                //let arrayNegrasBlancasGananEstrategia=["6a","5b","4b","3b","8d","8e","8f","7f","6g","5g","4f"];
                //let arrayNegrasGanan=["7d","6d","5c","4d","3d","2e"];
                //let arrayNegrasEjemploMovimiento=["3d","6c","6d"];
                //let arrayNegras=["7b","7d","2e","3h","8d","8g","7g","7h"];
                //let arrayNegrasBlancasGanan=["6c","3c","4d","6e","5f"];
                //let arrayNegrasDobleVictoria=["7c","3c","4d","4e","6f"];
                //let arrayNegrasPartidaBug=["6c","6e","6g","7g","5f","5g","4f"];
                //let arrayNegrasEjemplo=["6c","1g","3c","2g","3h"];
                // let arrayNegras=["1c","1d","8b","8d","8e","8f","5d","5f","5g","4g","3g","3h"];
                //let arrayNegras=["1g","2g","3h","6e","5f","1c","4d","3g"];
                //let arrayNegrasBloqueo=["6g","5g","4g","3g","3b","1c","1d","3g"];
                //let arrayNegrasEjemplo=["8d","8e","8f","7f","6g","5g","4f","6a","5b","4b","3b"];
                //let arrayNegrasStaleMate=["7c","7g","5c","5g","4b","4d","4f","4h","3c","3g","1c","1g"];
                // let arrayNegras=["6d","5e","4d","3e","2d"];
                //let arrayNegrasImposibles2=["1f","2f","3f","1h","3g","3h"];
                //let arrayNegrasImposibles=["1a","2a","3a","1b","1c","1d","1e","1f","1g","1g","1h","2h","3h"];
                for (let index = 0; index < arrayNegras.length; index++) {
                     fichasNegras[index]=(new fichaTablero(casillas[map1.get(arrayNegras[index])],"negras",escena,casillasBoard[map1.get(arrayNegras[index])]));   
                }

            }
        }
        function colocarFichasBlancas(){
            if (defaultBoard) {
                var positionX;
                var positionY;
                let i=0;
                //Primera fila
                for (let index = 1; index < 7; index++) {
                    positionX=casillasBoard[index*8].posX;
                    positionY=casillasBoard[index*8].posY;
    
                    //A??adimos la fichita
                    fichasBlancas[i]=new fichaTablero(casillas[index*8],"blancas",escena,casillasBoard[index*8]);
                     i++;
                }
                for (let index = 1; index < 7; index++) {
                    positionX=casillasBoard[(index+1)*8-1].posX;
                    positionY=casillasBoard[(index+1)*8-1].posY;
                    
                    //A??adimos la fichita
                    fichasBlancas[i]=new fichaTablero(casillas[(index+1)*8-1],"blancas",escena,casillasBoard[(index+1)*8-1]);;
                     i++;
                }
            }
            else{
                let arrayBlancas=["7b","7d","2e","3h","8d"];
                //let arrayBlancasEstrategiaEncontrarMovimientoGanador=["6a","5a","4a","7c","5c","2c","7f","6f","2f","5h","4h"];
                //let arrayBlancasEstrategiaMenosEsMas=["6e","4d","4b","8e","4h","6e","3a","1f",""];
                //let arrayBlancasBloqueoEstrategia=["8e","2e","2h","1h"];
                //let arrayBlancasGananEstrategias=["4c","6d","5d","4e","6e","7e","5f","6f","4g","4h"];
                //let arrayBlancasNegrasGanan=["8b","8c","8d","6e","5d","5f","4e","4f","3c","2h"];
                //let arrayBlancasEjemploMovimiento=["2a","7a","8c","5e","4d","3e","1f","7h","5h","2h"];
                //let arrayBlancasVictoria=["7h","7d","7c","8d"];
                //let arrayBlancasPartida1Bug=["7d","7e","7h","6d","6f","5e","5h","4h"];
                //let arrayBlancasDobleVictoria=["7b","7d","4c"];
                //let arrayBlancas=["6a","5a","4a","7c","5c","2c","7f","6f","2f","5h","4h"];
                //let arrayBlancasMenosEsMas=["8e","6e","3a","4b","1g","4h","4d","1f"];
                //let arrayBlancasStalemate=["7e","6b","6d","6f","6h","5e","3e","2b","2d","2f","2h","1e"];
                //let arrayBlancasBloqueo=["7h","6h","5h","4h","3h", "7a","5a","4a","3e"];
                //let arrayBlancasBlock=["1h","2h","2e","3h","8d"];
                //let arrayBlancasEjemploCentro=["7e","6e","4e","6f","5f","4g","4h","6d","5d","4c"];
                //let arrayBlancasImposibles2=["1g","2g","2h"];
                //let arrayBlancasImposibles=["6e","5d","4e","3d","2e"];
                
                for (let index = 0; index < arrayBlancas.length; index++) {
                     fichasBlancas[index]=(new fichaTablero(casillas[map1.get(arrayBlancas[index])],"blancas",escena,casillasBoard[map1.get(arrayBlancas[index])]));   
                }
            }
            //Ultima fila
            
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

                    if(casillasBoard[getCasillaObjetoById((idFichaFila+i)+letrasTablero[indexLetrasCasilla-i])].tieneFicha==colorContrario){
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
        function moves_Ficha_Func(Ficha){
            let moves_for_ficha=[];
            moveHorizontal(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            moveVertical(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            moveDiagonalAscendente(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            moveDiagonalDescendente(Ficha).forEach(element => {
                moves_for_ficha.push(element);
            });
            return moves_for_ficha;

        }
        function moves_negras(){
            let mapFicha_Moves = new Map();
            for (let i = 0; i < fichasNegras.length; i++) {
                mapFicha_Moves.set(fichasNegras[i],moves_Ficha_Func(fichasNegras[i]));
            }
            return mapFicha_Moves;
        }
        function moves_blancas(){
            let mapFicha_Moves = new Map();
            for (let i = 0; i < fichasBlancas.length; i++) {
                mapFicha_Moves.set(fichasBlancas[i],moves_Ficha_Func(fichasBlancas[i]));
            }
            return mapFicha_Moves;
        }
        function terminarPartidaBlancas(){
            let fichasConectadasCopy = fichasConectadas(fichasBlancas[0]);
                if (fichasConectadasCopy.length==fichasBlancas.length) {
                    partidaAcabada=true;
                    alert("Ganan Blancas \nDale al bot??n de refrescar si quieres seguir jugando");
                }
        }
        function terminarPartidaNegras(){
            let fichasConectadasCopy = fichasConectadas(fichasNegras[0]);
                if (fichasConectadasCopy.length==fichasNegras.length) {
                    partidaAcabada=true;
                    alert("Ganan Negras\nDale al bot??n de refrescar si quieres seguir jugando");
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
                let casilla_destino;
                let casilla_inicial;
                let ficha_comida=false;
                let jugador = Ficha.jugador;
                let casillaPintar=casillasBoard[map1.get(element)];
                casillasHighlighted[indexMoves]=gameScene.add.rectangle(casillaPintar.posX,casillaPintar.posY,ladoCasilla,ladoCasilla);
                mapCasillasHighlighted.set(casillasHighlighted[indexMoves],casillaPintar.id);
                casillasHighlighted[indexMoves].setStrokeStyle(4, 0x9172AC);
                casillasHighlighted[indexMoves].setInteractive().on('pointerup',function(){
                    if (Ficha!=null) {
                        casilla_inicial=Ficha.casillaObjeto.idTablero;
                        Ficha.fichaCanvas.destroy();
                        Ficha.casillaObjeto.tieneFicha=false;
                        Ficha.casilla=null;
                        Ficha=null;
                        
                    }
                    if (casillasBoard[mapCasillasHighlighted.get(this)].tieneFicha) {
                        ficha_comida=true;
                        getFichaByCasillasBoard(casillasBoard[mapCasillasHighlighted.get(this)]);
                    }
                    casilla_destino=casillasBoard[mapCasillasHighlighted.get(this)].idTablero;
                    Ficha=new fichaTablero(casillas[mapCasillasHighlighted.get(this)],jugador,gameScene,casillasBoard[mapCasillasHighlighted.get(this)]);
                    logMovimientos.push(new MovementLog(Ficha,casilla_inicial,casilla_destino,ficha_comida));
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
                    if (!jugadorVSjugador && !partidaAcabada) {
                        moveAI();
                    }
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
        function centroDeMasasNegrasFunc(){
            let SumPosX=0;
            let SumPosY=0;

            for (let i = 0; i < fichasNegras.length; i++) {
                    SumPosX+=parseInt(fichasNegras[i].casillaObjeto.idTablero.split("")[0]);
                    SumPosY+=letrasTablero.indexOf(fichasNegras[i].casillaObjeto.idTablero[1])+1;                
            }
            centroDeMasaNegras.posX=Number((SumPosX/fichasNegras.length).toFixed(0));
            centroDeMasaNegras.posY=Number((SumPosY/fichasNegras.length).toFixed(0));
            return centroDeMasaNegras;
        }
        function centroDeMasasBlancasFunc(){
            let SumPosX=0;
            let SumPosY=0;

            for (let i = 0; i < fichasBlancas.length; i++) {
                    SumPosX+=parseInt(fichasBlancas[i].casillaObjeto.idTablero.split("")[0]);
                    SumPosY+=letrasTablero.indexOf(fichasBlancas[i].casillaObjeto.idTablero[1])+1;                
            }
            centroDeMasaBlancas.posX=Number((SumPosX/fichasBlancas.length).toFixed(0));
            centroDeMasaBlancas.posY=Number((SumPosX/fichasBlancas.length).toFixed(0));
            return centroDeMasaBlancas;
        }
        function distanciaMediaEquipoNegras(){
            let distanceMediaEquipo=0;
            centroDeMasasNegrasFunc();
            for (let i = 0; i < fichasNegras.length; i++) {
                distanceMediaEquipo += distanciaFichaCentroMasas(fichasNegras[i],centroDeMasaNegras);
            }
            return distanceMediaEquipo/fichasNegras.length;
        }
        function distanciaMediaEquipoBlancas(){
            let distanceMediaEquipo=0;
            centroDeMasasBlancasFunc();
            for (let i = 0; i < fichasBlancas.length; i++) {
                distanceMediaEquipo += distanciaFichaCentroMasas(fichasBlancas[i],centroDeMasaBlancas);
            }
            return distanceMediaEquipo/fichasBlancas.length;
        }
        function concentracionNegras(){
            
            let concentracionNegras=distanciaMediaEquipoNegras();

            return 1/concentracionNegras;

        }
        function concentracionBlancas(){
            
            let concentracionBlancas=distanciaMediaEquipoBlancas();

            return 1/concentracionBlancas;

        }
        function fichasEnBordeNegras(){
            let fichasEnBordeNegras=0;
            for (let i = 0; i < fichasNegras.length; i++) {
                if(fichasNegras[i].casillaObjeto.CasillaLimite){
                    fichasEnBordeNegras++;
                }
                
            }
            return fichasEnBordeNegras;
        }
        function fichasEnBordeBlancas(){
            let fichasEnBordeBlancas=0;
            for (let i = 0; i < fichasBlancas.length; i++) {
                if(fichasBlancas[i].casillaObjeto.CasillaLimite){
                    fichasEnBordeBlancas++;
                }
                
            }
            return fichasEnBordeBlancas;
        }
        function distanciaFichaCentroMasas(Ficha,centroDeMasas){
                let posX = parseInt(Ficha.casillaObjeto.idTablero.split("")[0]);
                let posY = letrasTablero.indexOf(Ficha.casillaObjeto.idTablero[1])+1;
                let distance=0;
                if (posX == centroDeMasas.posX) {
                   return  distance = Math.abs(posY-centroDeMasas.posY);
                }
                if (posY == centroDeMasas.posY) {

                   return  distance = Math.abs(posX-centroDeMasas.posX);
                }
                if (Math.abs(posX-centroDeMasas.posX)<=Math.abs(posY-centroDeMasas.posY)) {
                    distance=Math.abs(posX-centroDeMasas.posX);
                    if (posY-centroDeMasas.posY>=0) {
                        return distance+=Math.abs(posY-centroDeMasas.posY)-distance
                    }
                    if (posY-centroDeMasas.posY<0) {

                        return distance+=Math.abs(posY-centroDeMasas.posY)-distance
                    }
                }
                if (Math.abs(posY-centroDeMasas.posY)<=Math.abs(posX-centroDeMasas.posX)) {
                    distance=Math.abs(posY-centroDeMasas.posY);
                    if (posX-centroDeMasas.posX>=0) {

                        return distance+=Math.abs(posX-centroDeMasas.posX)-distance
                    }
                    if (posX-centroDeMasas.posX<0) {
                       return distance+=Math.abs(posX-centroDeMasas.posX)-distance
                    }
                }

                return distance;
        }
        function distancia_centrTablero_CdM_Blancas(){
                centroDeMasasBlancasFunc();
                let centroTablero = new CentroDeMasas();
                centroTablero.posX=4.5;
                centroTablero.posY=4.5
                let val_x;
                let val_y;
                val_x=centroTablero.posX-Math.pow((centroTablero.posX-centroDeMasaBlancas.posX),2);
                val_y=centroTablero.posY-Math.pow((centroTablero.posY-centroDeMasaBlancas.posY),2);

                return val_x+val_y;
        }
        function distancia_centrTablero_CdM_Negras(){
            centroDeMasasNegrasFunc();
            let centroTablero = new CentroDeMasas();
            centroTablero.posX=4.5;
            centroTablero.posY=4.5
            let val_x;
            let val_y;
            val_x=centroTablero.posX-((centroTablero.posX-centroDeMasaNegras.posX)*(centroTablero.posX-centroDeMasaNegras.posX));
            val_y=centroTablero.posY-((centroTablero.posY-centroDeMasaNegras.posY)*(centroTablero.posY-centroDeMasaNegras.posY));
            
            return val_x+val_y;
    }
    function funcEval(){
        let negrasGanan= gananNegras();
        let blancasGanan=gananBlancas();


        let arrayPesos=[100,20,1];


        let peso=arrayPesos[0]*(concentracionBlancas()-concentracionNegras())
        +arrayPesos[1]*(fichasEnBordeBlancas()
        -fichasEnBordeNegras())+distancia_centrTablero_CdM_Blancas()
        -10*fichasAisladasBlancas().length + 10*fichasAisladasNegras().length
        -puntuacionFichasAisladasBlancas() + puntuacionFichasAisladasNegras()
        -distancia_centrTablero_CdM_Negras()+Math.random()+blancasGanan+negrasGanan;
        
        return peso;
    }
    function Is_next_move_eating(casilla){
        let comer=false;

    }
    function gananNegras(){

        let fichasConectadasCopy = fichasConectadas(fichasNegras[0]);
        if (fichasConectadasCopy.length==fichasNegras.length) {
            return Number.NEGATIVE_INFINITY;
        }
        else{
            return 0;
        }
    }
    function gananBlancas(){
            let fichasConectadasCopy = fichasConectadas(fichasBlancas[0]);
                if (fichasConectadasCopy.length==fichasBlancas.length) {
                    return Number.POSITIVE_INFINITY;
                }
                else{
                    return 0;
                }
    }
    function next_move_Blancas_TableroFic(Ficha,casilla,TableroFic){
        TableroFic.turno="negras";
        TableroFic.profundidad=1;
        TableroFic.mapMovePrimigenio.set(new FichaFic(Ficha.jugador,Ficha.casillaObjeto.idTablero,Ficha.casillaObjeto.id),casilla);
        fichasBlancas.forEach(element => {
            if(element===Ficha){
                TableroFic.mapMoves.set(new FichaFic(Ficha.jugador,Ficha.casillaObjeto.idTablero,Ficha.casillaObjeto.id),casilla);
                TableroFic.fichasBlancas.push(new FichaFic(element.jugador,casilla,map1.get(casilla)));
                TableroFic.casillasTablero[map1.get(casilla)].tieneFicha=true;
                TableroFic.casillasTablero[map1.get(casilla)].colorFicha="blancas";
            }
            else{
                TableroFic.fichasBlancas.push(new FichaFic(element.jugador,element.casillaObjeto.idTablero,element.casillaObjeto.id));
                TableroFic.casillasTablero[element.casillaObjeto.id].tieneFicha=true;
                TableroFic.casillasTablero[element.casillaObjeto.id].colorFicha="blancas";
            }

        });
        for (let i = 0; i < fichasNegras.length; i++) {
            if(fichasNegras[i].casillaObjeto.idTablero==casilla){
            }
            else{
                TableroFic.fichasNegras.push(new FichaFic(fichasNegras[i].jugador,fichasNegras[i].casillaObjeto.idTablero,fichasNegras[i].casillaObjeto.id));
                TableroFic.casillasTablero[fichasNegras[i].casillaObjeto.id].tieneFicha=true;
                TableroFic.casillasTablero[fichasNegras[i].casillaObjeto.id].colorFicha="negras";

            }
           
       }
    }

    function conversorTableroFic(TableroFic){
        fichasBlancas.forEach(element => {
            TableroFic.fichasBlancas.push(new FichaFic(element.jugador,element.casillaObjeto.idTablero,element.casillaObjeto.id));
            TableroFic.casillasTablero[element.casillaObjeto.id].tieneFicha="blancas";
        });
        fichasNegras.forEach(element => {
            TableroFic.fichasNegras.push(new FichaFic(element.jugador,element.casillaObjeto.idTablero,element.casillaObjeto.id));
            TableroFic.casillasTablero[element.casillaObjeto.id].tieneFicha="negras";
        });
        return TableroFic;
    }

    //    let a = gameScene.add.rectangle(250,1000,ladoCasilla,ladoCasilla,0x9172AC).setInteractive();
    //    a.on('pointerup',function() {
    // //        //a.destroy();
    // //        casillasHighlighted.forEach(element =>{
    // //            element.destroy();
    // //        });
    // //         //  centroDeMasasNegrasFunc();
    // //         //  centroDeMasasBlancasFunc();
    // //         //  distanciaMediaEquipoNegras();
    // //         //  casillasBoard[map1.get(""+centroDeMasaNegras.posX+letrasTablero[(centroDeMasaNegras.posY-1)])].casillaCanvas.setStrokeStyle(4,0x2BB26E);
    // //         //  console.log(centroDeMasaBlancas);
    // //         let pruebaTablero = new TableroFic();
    // //          console.log(conversorTableroFic(pruebaTablero));
    // //          console.log(mapBaseDeDatos.get(objectHash(pruebaTablero)));
    // //          console.log(puntuacionFichasAisladasBlancas());
    // //          console.log(puntuacionFichasAisladasNegras());
    //          console.log(funcEval());
    //          //console.log(moves_blancas());
    //     //    console.log("Blancas: "+fichasBlancas.length);
    //    });
       let mapaPrueba= new Map();
       mapaPrueba.set(1,"culo");
       let retroceder = gameScene.add.rectangle(360,960,160,60,0x9991BD).setInteractive();
       let clickado = false;
       retroceder.on('pointerup',function() {
             setTimeout(function() {
                retroceder.setStrokeStyle(0,0xF1E943);
            }, 100);
            console.log(logMovimientos);
                retrocederMove();
                retroceder.setStrokeStyle(4,0xF1E943);
               

       });
       let refrescarBoton = gameScene.add.rectangle(540,960,160,60,0x9991BD).setInteractive();
       
       refrescarBoton.on('pointerup',function() {
            setTimeout(function() {
                refrescarBoton.setStrokeStyle(0,0xF1E943);
            }, 100);
            refrescar();
            refrescarBoton.setStrokeStyle(4,0xF1E943);
       });

    //    arrayTablerosProfundidad2.forEach(element => {
    //         element.forEach(arrayInside =>{
    //             arrayTablerosProfundidad3.push(arrayInside.all_next_moves_TableroFic());
    //         });
    //     }); 
        function updateArrayTablerosProfundidad1(arrayTablerosProfundidad1){
            for (let j = 0,contador=0; j < fichasBlancas.length; j++) {
                for (let i = 0; i < moves_Ficha_Func(fichasBlancas[j]).length; i++) {
                    arrayTablerosProfundidad1.push(new TableroFic());
                    next_move_Blancas_TableroFic(fichasBlancas[j],moves_Ficha_Func(fichasBlancas[j])[i],arrayTablerosProfundidad1[contador]);
                    contador++;
                }
           }
        }

        function updateArrayTablerosProfundidad2(arrayTablerosProfundidad1,arrayTablerosProfundidad2){
            arrayTablerosProfundidad1.forEach(element => {
                arrayTablerosProfundidad2.push(element.all_next_moves_TableroFic());
            });
        }
        function getBestMoveDepth2(){
            let arrayTablerosProfundidad1= [];
            updateArrayTablerosProfundidad1(arrayTablerosProfundidad1);
            let arrayTablerosProfundidad2=[];
            updateArrayTablerosProfundidad2(arrayTablerosProfundidad1,arrayTablerosProfundidad2);
            
            let arrayTablerosProfundidad3= [];
            let arrayTablerosProfundidad4=[];

            let treePrueba= new Tree("Move Blancas");
            arrayTablerosProfundidad1.forEach(element =>{
                treePrueba.addChild(element);
            });
            for (let i = 0; i < arrayTablerosProfundidad1.length; i++) {
                    arrayTablerosProfundidad2[i].forEach(element => {
                        treePrueba.children[i].addChild(element);
                    });
            }
            for (let index = 0; index < treePrueba.children.length; index++) {
                let min=Number.POSITIVE_INFINITY;
                treePrueba.children[index].children.forEach(element => {
                    let valor_funcEval=element.val.funcEval();
                    if (valor_funcEval<min) {
                        min=valor_funcEval;
                        treePrueba.children[index].valEval=valor_funcEval;
                        treePrueba.children[index].tableroFic=element.val
                    }
                })
            }
        
            let max=Number.NEGATIVE_INFINITY;
            treePrueba.children.forEach(element =>{
                if (element.valEval>max) {
                    treePrueba.valEval=element.valEval;
                    treePrueba.tableroFic=element.tableroFic;
                    max=element.valEval;
                }
            });
            if(treePrueba.tableroFic==null){
                console.log("Hola");
                treePrueba.tableroFic=treePrueba.children[0].tableroFic;
            }
            console.log(treePrueba);
            const iterator1 = treePrueba.tableroFic.mapMovePrimigenio;
            console.log();
            let nextMove =new MovementFichaFic(iterator1.keys().next().value,iterator1.values().next().value);
            return nextMove;
        }

        function arbolDepth1(){
            let arrayTablerosProfundidad1= [];
            let arbolGanador=new Tree("Move Blancas");
            updateArrayTablerosProfundidad1(arrayTablerosProfundidad1);

            let treePrueba= new Tree("Move Blancas");
            arrayTablerosProfundidad1.forEach(element =>{
                treePrueba.addChild(element);
            });
            for (let index = 0; index < treePrueba.children.length; index++) {
                let gananBlancas=treePrueba.children[index].val.gananBlancas();
                if (gananBlancas==Number.POSITIVE_INFINITY) {
                    console.log(treePrueba.children[index]);
                    arbolGanador.tableroFic=treePrueba.children[index].val;
                    return arbolGanador
                }
                let gananNegras=treePrueba.children[index].val.gananNegras();
                if (gananNegras==Number.NEGATIVE_INFINITY) {
                    
                }
                
            }
            return treePrueba;
        }
        function arbolDepth2(){

            let treePrueba=arbolDepth1();
            treePrueba.children.forEach(element =>{
                let tableroPruebaProfundidad2=element.val.all_next_moves_TableroFic();
                tableroPruebaProfundidad2.forEach(subelement =>{
                    element.addChild(subelement);
                });
            });
            return treePrueba;
        }
        function arbolDepth3(){
            let treePrueba=arbolDepth2();
            treePrueba.children.forEach(element =>{
                //console.log(element);
                element.children.forEach(subelement =>{
                    let tableroPruebaProfundidad3=subelement.val.all_next_moves_TableroFic();
                    tableroPruebaProfundidad3.forEach(insideElement =>{
                        subelement.addChild(insideElement);
                    })
                });
            });
            return treePrueba;

        }

        function fichasAisladasNegras(){
            let fichasAisladas = [];
            fichasNegras.forEach( element =>{
                //console.log(fichasConectadas(element));
                if (fichasConectadas(element).length == 1) {
                    fichasAisladas.push(element);
                }
            });
            return fichasAisladas;
        }


        function fichasAisladasBlancas(){
            let fichasAisladas = [];
            fichasBlancas.forEach( element =>{
                if (fichasConectadas(element).length == 1) {
                    fichasAisladas.push(element);
                }
            });
            return fichasAisladas;
        }

        function puntuacionFichasAisladasNegras(){
            let puntuacion=0;
            let fichasAisladas=fichasAisladasNegras();
            fichasAisladas.forEach(element =>{
                let nextMovesFicha=moves_Ficha_Func(element).length
                if (nextMovesFicha==0) {
                    puntuacion+=500;
                }
                else{
                    puntuacion+=(50/(nextMovesFicha*2));
                }
            });
            return puntuacion;
        }
        function puntuacionFichasAisladasBlancas(Ficha){
            let puntuacion=0;
            let fichasAisladas=fichasAisladasBlancas();
            fichasAisladas.forEach(element =>{
                let nextMovesFicha=moves_Ficha_Func(element).length
                if (nextMovesFicha==0) {
                    puntuacion+=500;
                }
                else{
                    puntuacion+=(50/(nextMovesFicha*2));
                }
            });
            return puntuacion;

        }

        function getBestMoveDepth3(){
            let numberElements=0;
            let arrayTablerosProfundidad1= [];
            updateArrayTablerosProfundidad1(arrayTablerosProfundidad1);

            let treePrueba= arbolDepth3();
            for (let indexTreeDepth1 = 0; indexTreeDepth1 < treePrueba.children.length; indexTreeDepth1++) {

                for (let indexTreeDepth2 = 0; indexTreeDepth2 < treePrueba.children[indexTreeDepth1].children.length; indexTreeDepth2++) {
                    let max=Number.NEGATIVE_INFINITY;
                    treePrueba.children[indexTreeDepth1].children[indexTreeDepth2].children.forEach(element =>{
                        let valor_funcEval=element.val.funcEval();

                        if (valor_funcEval>=max) {
                            treePrueba.children[indexTreeDepth1].children[indexTreeDepth2].valEval=valor_funcEval;
                            treePrueba.children[indexTreeDepth1].children[indexTreeDepth2].tableroFic=element.val
                        }
                        numberElements++
                    });
                    
                }

            }

            //Segunda tanda
            for (let indexTreeDepth1 = 0; indexTreeDepth1 < treePrueba.children.length; indexTreeDepth1++) {
                let min=Number.POSITIVE_INFINITY;
                for (let indexTreeDepth2 = 0; indexTreeDepth2 < treePrueba.children[indexTreeDepth1].children.length; indexTreeDepth2++){
                    // console.log(treePrueba.children[indexTreeDepth1].children[indexTreeDepth2]);
                    if (treePrueba.children[indexTreeDepth1].children[indexTreeDepth2].valEval<=min) {
                        treePrueba.children[indexTreeDepth1].valEval=treePrueba.children[indexTreeDepth1].children[indexTreeDepth2].valEval;
                        treePrueba.children[indexTreeDepth1].tableroFic=treePrueba.children[indexTreeDepth1].children[indexTreeDepth2].val
                    }
                }
            }

            //??ltima tanda
            let maxMAX= Number.NEGATIVE_INFINITY;
            for (let indexTreeDepth1 = 0; indexTreeDepth1 < treePrueba.children.length; indexTreeDepth1++) {
                if(treePrueba.children[indexTreeDepth1].valEval>=maxMAX){
                    maxMAX=treePrueba.children[indexTreeDepth1].valEval;
                    treePrueba.valEval=treePrueba.children[indexTreeDepth1].valEval;
                    treePrueba.tableroFic=treePrueba.children[indexTreeDepth1].tableroFic;
                }
            
            }
            console.log(numberElements);
        

            if(treePrueba.tableroFic==null){
                treePrueba.tableroFic=treePrueba.children[0].tableroFic;
            }
            console.log(treePrueba);
            const iterator1 = treePrueba.tableroFic.mapMovePrimigenio;
            console.log();
            let nextMove =new MovementFichaFic(iterator1.keys().next().value,iterator1.values().next().value);
            return nextMove;
        }

        function removeAllFichas(){
            fichasNegras.forEach(element =>{
                    element.fichaCanvas.destroy();
                    element.casillaObjeto.tieneFicha=false;
                    element.casilla=null;
            });
            fichasBlancas.forEach(element =>{
                element.fichaCanvas.destroy();
                element.casillaObjeto.tieneFicha=false;
                element.casilla=null;
            });
        }
        function refrescar(){
            removeAllFichas();
            colocarFichasBlancas();
            colocarFichasNegras();
            casillasHighlighted.forEach(element =>{
               element.destroy();
           });
           turnoPartida=false;
           partidaAcabada=false;
           logMovimientos=[];
           if (casillaSeleccionada!=null) {
            casillaSeleccionada.destroy();
           }
        }
        function retrocederMove(){
            console.log(logMovimientos);
            if (logMovimientos.length>=1) {
                if (jugadorVSjugador) {
                    let copia = logMovimientos.pop();
                }
                else{
                    let check="";
                    let fichaComida;
                    let copia = logMovimientos.pop();
                    let FichaA=getFichaByIdBoard(copia.casilla_to);
                    console.log(FichaA);
                    FichaA.fichaCanvas.destroy();
                    FichaA.casillaObjeto.tieneFicha=false;
                    FichaA.casilla=null;
                    FichaA=null;

                    let Ficha=new fichaTablero(casillas[map1.get(copia.casilla_inicial)],copia.ficha.jugador,gameScene,casillasBoard[map1.get(copia.casilla_inicial)]);
                    fichasBlancas.push(Ficha);
                    if (copia.ficha_comida) {
                        fichaComida=new fichaTablero(casillas[map1.get(copia.casilla_to)],oppositeColor(copia.ficha),gameScene,casillasBoard[map1.get(copia.casilla_to)]);
                        fichasNegras.push(fichaComida);
                        check=copia.casilla_to;
                    }
                    

                    copia = logMovimientos.pop();
                    if (check===copia.casilla_to) {
                        fichaComida.fichaCanvas.destroy();
                        fichaComida.casillaObjeto.tieneFicha=false;
                        fichaComida.casilla=null
                        fichasNegras.pop();
                    }   

                    FichaA=getFichaByIdBoard(copia.casilla_to);
                    FichaA.fichaCanvas.destroy();
                    FichaA.casillaObjeto.tieneFicha=false;
                    FichaA.casilla=null;
                    FichaA=null;

                    Ficha=new fichaTablero(casillas[map1.get(copia.casilla_inicial)],copia.ficha.jugador,gameScene,casillasBoard[map1.get(copia.casilla_inicial)]);
                    fichasNegras.push(Ficha);
                    if (copia.ficha_comida) {
                        let fichaComida=new fichaTablero(casillas[map1.get(copia.casilla_to)],oppositeColor(copia.ficha),gameScene,casillasBoard[map1.get(copia.casilla_to)]);
                        fichasBlancas.push(fichaComida);
                    }
                }
            }
            casillasHighlighted.forEach(element =>{
                element.destroy();
            });
            if (casillaSeleccionada!=null) {
             casillaSeleccionada.destroy();
            }
            reciclar(fichasNegras);
            reciclar(fichasBlancas);

        }
        function getBestMoveDepth1(){
            let arrayTablerosProfundidad1= [];
            updateArrayTablerosProfundidad1(arrayTablerosProfundidad1);


            let treePrueba= new Tree("Move Blancas");
            arrayTablerosProfundidad1.forEach(element =>{
                treePrueba.addChild(element);
            });
            for (let index = 0; index < treePrueba.children.length; index++) {
                let max=Number.NEGATIVE_INFINITY;
                
                    let valor_funcEval=treePrueba.children[index].val.funcEval();
                    treePrueba.children[index].valEval=valor_funcEval;
                    if (valor_funcEval>max) {
                        max=valor_funcEval;
                        treePrueba.valEval=valor_funcEval;
                        treePrueba.tableroFic=treePrueba.children[index].val
                    }

            }
            
            console.log(treePrueba.children);
            const iterator1 = treePrueba.tableroFic.mapMovePrimigenio;
            let nextMove =new MovementFichaFic(iterator1.keys().next().value,iterator1.values().next().value);
            return nextMove;
        }



        if (!jugadorVSjugador) {
            console.log("Are you ready for the challenge ?");
        }
        function moveAI(){
            if (!jugadorVSjugador && turnoPartida==true) {
                let posX=0;
                let posY=0;
                let movement;
                if (fichasNegras.length>3) {
                     movement =getBestMoveDepth2();
                }
                else{
                    movement =getBestMoveDepth3();
                }
                let casilla_inicial=movement.casillaFicha;
                let casilla_destino=movement.to_casilla;
                let ficha_comida=false;

                let indexFichaToMove=fichasBlancas.indexOf(getFichaByIdBoard(movement.casillaFicha));
                let indexFicha_comida=fichasNegras.indexOf(getFichaByIdBoard(movement.to_casilla));
                if (fichasBlancas[indexFichaToMove]!=null) {
                    posX=fichasBlancas[indexFichaToMove].fichaPosX;
                    posY=fichasBlancas[indexFichaToMove].fichaPosY;
                    fichasBlancas[indexFichaToMove].fichaCanvas.destroy();
                    fichasBlancas[indexFichaToMove].casillaObjeto.tieneFicha=false;
                    fichasBlancas[indexFichaToMove].casilla=null;
                }
                if (fichasNegras[indexFicha_comida]!=null) {
                    ficha_comida=true;
                    fichasNegras[indexFicha_comida].fichaCanvas.destroy();
                    fichasNegras[indexFicha_comida].casillaObjeto.tieneFicha=false;
                    fichasNegras[indexFicha_comida].casilla=null;
                }
                let Ficha=new fichaTablero(casillas[map1.get(movement.to_casilla)],"blancas",gameScene,casillasBoard[map1.get(movement.to_casilla)]);
                logMovimientos.push(new MovementLog(Ficha,casilla_inicial,casilla_destino,ficha_comida));
                fichaSeleccionada=Ficha.fichaCanvas;
                fichaSeleccionada.setStrokeStyle(4,0xE5E228);
                casillaSeleccionada=gameScene.add.rectangle(posX,posY,ladoCasilla,ladoCasilla);
                casillaSeleccionada.setStrokeStyle(4,0xAF4054);
                fichasBlancas.push(Ficha);
                turnoPartida=false;
                reciclar(fichasNegras);
                reciclar(fichasBlancas);
                terminarPartidaNegras();
                terminarPartidaBlancas();
            }
        }
        moveAI();
        let refresh=this.add.image(540, 960, 'refresh');
        refresh.setScale(0.35);
        let backwards=this.add.image(360, 960, 'backwards');
        backwards.setScale(0.1);
        let indexTestPrueba=5;
    //    console.log(arrayTablerosProfundidad1);
    //    console.log(arrayTablerosProfundidad2);
    //    console.log(arrayTablerosProfundidad3);
    //    console.log(getBestMoveDepth3());
    //    console.log(arrayTablerosFicBlancas[indexTestPrueba].mapMoves);
    //    arrayTablerosFicBlancas[indexTestPrueba].next_move_Negras_TableroFic(arrayTablerosFicBlancas[indexTestPrueba].fichasNegras[1],arrayTablerosFicBlancas[indexTestPrueba].moves_Ficha_Func(arrayTablerosFicBlancas[indexTestPrueba].fichasNegras[1])[0],tableroPruebaProfundidad2);
    //    console.log(tableroPruebaProfundidad2.mapMoves);
    //    console.log(tableroPruebaProfundidad2.next_move_Blancas_TableroFic(tableroPruebaProfundidad2.fichasBlancas[0],tableroPruebaProfundidad2.moves_Ficha_Func(tableroPruebaProfundidad2.fichasBlancas[0])[0],tableroPruebaProfundidad3));
    //    arrayTablerosProfundidad3= tableroPruebaProfundidad2.all_next_moves_TableroFic();
    //    console.log(arrayTablerosProfundidad3[0].mapMoves);
    //    console.log(arrayTablerosProfundidad3[0].all_next_moves_TableroFic());
    //    console.log(tableroPruebaProfundidad3);
    //    console.log(tableroPruebaProfundidad3.funcEval());
}