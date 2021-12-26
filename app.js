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
let casillaSeleccionada=null;
let fichasNegras = [];
let identificadoresTablero=[];
let turnoPartida=true;
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
function preload ()
{
    //this.load.setBaseURL('http://labs.phaser.io');

    //this.load.image('sky', 'assets/skies/space3.png');
    //this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    //this.load.image('red', 'assets/particles/red.png');
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
                    if(this.casillasTablero[map1.get((idFichaFila+i)+letrasTablero[indexLetrasCasilla-1])].colorFicha==colorContrario){
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

        funcEval(){
            let arrayPesos=[1000,20,1];
            let peso=arrayPesos[0]*(this.concentracionBlancas()-this.concentracionNegras())+arrayPesos[1]*(this.fichasEnBordeBlancas()-this.fichasEnBordeNegras())+this.distancia_centrTablero_CdM_Blancas()-this.distancia_centrTablero_CdM_Negras()+Math.random();
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
            defaultBoard=false;
            if(defaultBoard){
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
            else{
                let arrayNegras=["6c","3c","4d","6e","5f"];
                for (let index = 0; index < arrayNegras.length; index++) {
                     fichasNegras[index]=(new fichaTablero(casillas[map1.get(arrayNegras[index])],"negras",escena,casillasBoard[map1.get(arrayNegras[index])]));   
                }

            }
        }
        function colocarFichasBlancas(){
            defaultBoard=false;
            if (defaultBoard) {
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
            }
            else{
                let arrayBlancas=["7b","7d","2e","3h","8d"];
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
                    alert("Ganan Blancas");
                }
        }
        function terminarPartidaNegras(){
            let fichasConectadasCopy = fichasConectadas(fichasNegras[0]);
                if (fichasConectadasCopy.length==fichasNegras.length) {
                    partidaAcabada=true;
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
        let arrayPesos=[1000,20,1]
        let peso=arrayPesos[0]*(concentracionBlancas()-concentracionNegras())+arrayPesos[1]*(fichasEnBordeBlancas()-fichasEnBordeNegras())+distancia_centrTablero_CdM_Blancas()-distancia_centrTablero_CdM_Negras()+Math.random();
        return peso;
    }
    function Is_next_move_eating(casilla){
        let comer=false;

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
            TableroFic.casillasTablero[element.casillaObjeto.id].tieneFicha=true;
        });
        fichasNegras.forEach(element => {
            TableroFic.fichasNegras.push(new FichaFic(element.jugador,element.casillaObjeto.idTablero,element.casillaObjeto.id));
            TableroFic.casillasTablero[element.casillaObjeto.id].tieneFicha=true;
        });
        return TableroFic;
    }

       let a = gameScene.add.rectangle(900,900,ladoCasilla,ladoCasilla,0x9172AC).setInteractive();
       a.on('pointerup',function() {
           //a.destroy();
           casillasHighlighted.forEach(element =>{
               element.destroy();
           });
            //  centroDeMasasNegrasFunc();
            //  centroDeMasasBlancasFunc();
            //  distanciaMediaEquipoNegras();
            //  casillasBoard[map1.get(""+centroDeMasaNegras.posX+letrasTablero[(centroDeMasaNegras.posY-1)])].casillaCanvas.setStrokeStyle(4,0x2BB26E);
            //  console.log(centroDeMasaBlancas);
             console.log(getBestMoveDepth2());
             //console.log(moves_blancas());
        //    console.log("Blancas: "+fichasBlancas.length);
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
                        treePrueba.children[index].TableroFic=element.val
                    }
                })
            }
        
            let max=Number.NEGATIVE_INFINITY;
            treePrueba.children.forEach(element =>{
                if (element.valEval>max) {
                    treePrueba.valEval=element.valEval;
                    treePrueba.tableroFic=element.TableroFic;
                    max=element.valEval;
                }
            });
            const iterator1 = treePrueba.tableroFic.mapMovePrimigenio;
            console.log();
            let nextMove =new MovementFichaFic(iterator1.keys().next().value,iterator1.values().next().value);
            return nextMove;
        }
        //----------------Si quieres más de profundidad 3 descomenta
        // arrayTablerosProfundidad3.forEach(element => {
        //     element.forEach(arrayInside =>{
                
        //             arrayTablerosProfundidad4.push(arrayInside.all_next_moves_TableroFic());
               
        //     });
        // });
        // sleep time expects milliseconds
        setTimeout(() => {

            
            console.log("World!"); }, 2000);

        if (!jugadorVSjugador) {
            console.log("Are you ready for the challenge ?");
        }
        function moveAI(){
            if (!jugadorVSjugador) {
                let posX=0;
                let posY=0;
                let movement =getBestMoveDepth2();
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
                    fichasNegras[indexFicha_comida].fichaCanvas.destroy();
                    fichasNegras[indexFicha_comida].casillaObjeto.tieneFicha=false;
                    fichasNegras[indexFicha_comida].casilla=null;
                }
                let Ficha=new fichaTablero(casillas[map1.get(movement.to_casilla)],"blancas",gameScene,casillasBoard[map1.get(movement.to_casilla)]);
                fichaSeleccionada=Ficha.fichaCanvas;
                fichaSeleccionada.setStrokeStyle(4,0xE5E228);
                console.log(fichasBlancas);
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