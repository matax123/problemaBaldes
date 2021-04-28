var output = document.getElementById("output");
output.innerHTML = "Ingrese cantidad de baldes";
var input = document.getElementById("input");
var respuesta = document.getElementById("respuesta");
input.value = "2";
var botón = document.getElementById("botón");
botón.onclick = function () {
    siguiente(input.value);
    input.value = "";
}
var contador = 0;
var contadorCiclos = 0;


var cantidadBaldes;
var estadoInicial = [0, 0];
var capacidades = [5, 3];
var estadosObjetivo = [[4, 0], [4, 3]];

var baldes = [];


class Balde {
    constructor(id) {
        this.id = id;
        this.capacidad;
        this.estadoActual;
    }
}

class Nodo {
    constructor(estado, nodoPadre) {
        this.estado = estado;
        this.nodoPadre = nodoPadre;
        this.hijos = [];
        this.solución = false;
    }

    getNodoPadre() {
        return this.nodoPadre;
    }

    llenarBalde(id) {
        var aux = [];
        for (var i = 0; i < cantidadBaldes; i++) {
            if (i != id) {
                aux.push(this.estado[i]);
            }
            else {
                aux.push(0);
            }
        }
        aux[id] = baldes[id].capacidad;
        this.estado = aux;
    }

    vaciarBalde(id) {
        var aux = this.estado;
        aux[id] = 0;
        this.estado = aux;
    }

    traspasarAgua(idBalde1, idBalde2) {//traspasa el agua del balde 1 al balde 2 de ser posible
        if ((this.estado[idBalde2] < baldes[idBalde2].capacidad) && this.estado[idBalde1] != 0) {//si el balde 2 no está lleno y el balde 1 no está vacío
            var capacidadRestanteBalde2 = baldes[idBalde2].capacidad - this.estado[idBalde2];
            if (capacidadRestanteBalde2 > this.estado[idBalde1]) { //si el balde 2 tiene más capacidad que el balde 1 agua, se pasa todo el agua
                this.estado[idBalde2] = this.estado[idBalde2] + this.estado[idBalde1];
                this.estado[idBalde1] = 0;
            }
            else {//si el balde 2 tiene menos capacidad que el balde 1 agua, se llena el balde 2
                this.estado[idBalde1] = this.estado[idBalde1] - capacidadRestanteBalde2;
                this.estado[idBalde2] = this.estado[idBalde2] + capacidadRestanteBalde2;
            }
            return true; //se traspasó agua
        }
        else {
            return false; //no se pudo traspasar agua
        }
    }
}


async function siguiente(input) {
    if (contador == 0) {//se pide ingresar cantidad de baldes
        if (isNumeric(input)) {
            var número = parseInt(input);
            if (número >= 2 && número <= 10) {
                contador = 1; //se pasa al siguiente estado
                cantidadBaldes = número;
                output.innerHTML = "Ingrese la capacidad del balde " + contadorCiclos;
                input.value = "0";
                respuesta.innerHTML = "";
                for (var i = 0; i < cantidadBaldes; i++) {
                    var balde = new Balde(i);
                    baldes.push(balde);
                }
            }
            else {
                respuesta.innerHTML = "Por favor ingrese un número del 2 al 10";
            }
        }
        else {
            respuesta.innerHTML = "Por favor ingrese un número";
        }
        return;
    }
    if (contador == 1) { //se pide la capacidad de cada balde
        if (isNumeric(input)) {
            var número = parseInt(input);
            if (número > 1) {
                baldes[contadorCiclos].capacidad = número;
                contadorCiclos++;
                if (contadorCiclos == cantidadBaldes) {
                    contador = 2;//se pasa al siguente estado
                    contadorCiclos = 0;
                    output.innerHTML = "Ingrese el estado inicial del balde "+contadorCiclos;
                    respuesta.innerHTML = "";
                }
                else{
                    output.innerHTML = "Ingrese la capacidad del balde " + contadorCiclos;
                    respuesta.innerHTML = "";
                }
            }
            else {
                respuesta.innerHTML = "Por favor ingrese un número mayor a 0";
            }
        }
        else {
            respuesta.innerHTML = "Por favor ingrese un número";
        }
        return;
    }
    if (contador == 2) {//se pide el estado inicial de cada balde
        if (isNumeric(input)) {
            var número = parseInt(input);
            if (número >= 0) {
                if(número > baldes[contadorCiclos].capacidad){//el estado inicial no puede ser mayor a la capacidad
                    respuesta.innerHTML = "El estado inicial no puede ser mayor a la capacidad del balde";
                    return;
                }
                estadoInicial[contadorCiclos] = número;
                contadorCiclos++;
                if (contadorCiclos == cantidadBaldes) {
                    contador = 3;//se pasa al siguente estado
                    contadorCiclos = 0;
                    output.innerHTML = "Ingrese el estado objetivo del balde "+contadorCiclos;
                    respuesta.innerHTML = "";
                }
                else{
                    output.innerHTML = "Ingrese el estado inicial del balde "+contadorCiclos;
                    respuesta.innerHTML = "";
                }
            }
            else {
                respuesta.innerHTML = "No puede ingresar un número menor a 0";
            }
        }
        else {
            respuesta.innerHTML = "Por favor ingrese un número";
        }
        return;
    }
    if(contador == 3){//se pide el estado objetivo de cada balde
        if (isNumeric(input)) {
            var número = parseInt(input);
            if (número >= 0) {
                if(número > baldes[contadorCiclos].capacidad){//el estado inicial no puede ser mayor a la capacidad
                    respuesta.innerHTML = "El estado objetivo no puede ser mayor a la capacidad del balde";
                    return;
                }
                estadosObjetivo[contadorCiclos] = número;
                contadorCiclos++;
                if (contadorCiclos == cantidadBaldes) {
                    contador = 4;//se pasa al siguente estado
                    contadorCiclos = 0;
                    document.getElementById("input").style.display="none";
                    output.innerHTML = "Pulse siguiente para iniciar la búsqueda";
                    respuesta.innerHTML = "";
                }
                else{
                    output.innerHTML = "Ingrese el estado objetivo del balde "+contadorCiclos;
                    respuesta.innerHTML = "";
                }
            }
            else {
                respuesta.innerHTML = "No puede ingresar un número menor a 0";
            }
        }
        else {
            respuesta.innerHTML = "Por favor ingrese un número";
        }
        return;
    }
    if(contador == 4){//inicia la búsqueda
        output.innerHTML = "Búsqueda iniciada";
        respuesta.innerHTML = "";
        botón.style.display="none";
        await iniciar();
        if(soluciónEncontrada){
            respuesta.innerHTML = "Se encontrarón una o más soluciones";
        }
        else{
            respuesta.innerHTML = "No hay solución";
        }
    }
}

function isNumeric(num) {
    return !isNaN(num)
}

function iniciar() {
    var raíz = new Nodo(estadoInicial, null);
    algoritmo(raíz);
}

var soluciónEncontrada = false;

function algoritmo(nodoActual) {
    for (i = 0; i < cantidadBaldes; i++) {
        if (nodoActual.estado[i] != baldes[i].capacidad) {
            var nuevoNodo = new Nodo(null, null);
            copiarNodo(nuevoNodo, nodoActual);
            nuevoNodo.estado[i] = baldes[i].capacidad;
            if (!estadoRepetido(nuevoNodo)) {
                console.log("nuevoNodo de estado [" + nuevoNodo.estado + "], hijo de [" + nodoActual.estado + "]");
                nuevoNodo.nodoPadre = nodoActual;
                nodoActual.hijos.push(nuevoNodo);
            }
            if (estadoObjetivo(nuevoNodo.estado)) {
                nuevoNodo.solución = true;
                mostrarSolución(nuevoNodo);
                soluciónEncontrada = true;
                return;
            }
        }
        if (nodoActual.estado[i] > 0) {
            var nuevoNodo = new Nodo(null, null);
            copiarNodo(nuevoNodo, nodoActual);
            nuevoNodo.estado[i] = 0;
            if (!estadoRepetido(nuevoNodo)) {
                console.log("nuevoNodo de estado [" + nuevoNodo.estado + "], hijo de [" + nodoActual.estado + "]");
                nuevoNodo.nodoPadre = nodoActual;
                nodoActual.hijos.push(nuevoNodo);
            }
            if (estadoObjetivo(nuevoNodo.estado)) {
                nuevoNodo.solución = true;
                mostrarSolución(nuevoNodo);
                soluciónEncontrada = true;
                return true;
            }
        }
        for (ii = 0; ii < cantidadBaldes - 1 - i; ii++) {//posibles combinaciones entre todos los baldes (orden importa)
            var nuevoNodo = new Nodo(null, null);
            copiarNodo(nuevoNodo, nodoActual);
            if (nuevoNodo.traspasarAgua(i, cantidadBaldes - 1 - ii)) {
                if (!estadoRepetido(nuevoNodo)) {
                    console.log("nuevoNodo de estado [" + nuevoNodo.estado + "], hijo de [" + nodoActual.estado + "]");
                    nuevoNodo.nodoPadre = nodoActual;
                    nodoActual.hijos.push(nuevoNodo);
                }
                if (estadoObjetivo(nuevoNodo.estado)) {
                    nuevoNodo.solución = true;
                    mostrarSolución(nuevoNodo);
                    soluciónEncontrada = true;
                    return true;
                }
            }
            var nuevoNodo = new Nodo(null, null);
            copiarNodo(nuevoNodo, nodoActual);
            if (nuevoNodo.traspasarAgua(cantidadBaldes - 1 - ii, i)) {
                if (!estadoRepetido(nuevoNodo)) {
                    console.log("nuevoNodo de estado [" + nuevoNodo.estado + "], hijo de [" + nodoActual.estado + "]");
                    nuevoNodo.nodoPadre = nodoActual;
                    nodoActual.hijos.push(nuevoNodo);
                }
                if (estadoObjetivo(nuevoNodo.estado)) {
                    nuevoNodo.solución = true;
                    mostrarSolución(nuevoNodo);
                    soluciónEncontrada = true;
                    return true;
                }
            }
        }
    }
    nodoActual.hijos.forEach(nodoHijo => {
        algoritmo(nodoHijo);
    });
    return false;
}

function estadoObjetivo(estado) {
    for (var i = 0; i < estadosObjetivo.length; i++) {
        if (estado[0] == estadosObjetivo[0] && estado[1] == estadosObjetivo[1]) {
            console.log("estadoObjetivo=true");
            return true;
        }
    }
    console.log("estadoObjetivo=false");
    return false;
}

function estadoRepetido(nodoInicial) {//se checkea si alguno de los padres del nodo inicial tiene el mismo estado
    var nodoActual = new Nodo(null, null);
    copiarNodo(nodoActual, nodoInicial);
    if (nodoActual.nodoPadre == null) {
        return false;
    }
    while (nodoActual.nodoPadre != null) {
        var nodoActual = nodoActual.nodoPadre;
        if (nodoActual.estado[0] == nodoInicial.estado[0] && nodoActual.estado[1] == nodoInicial.estado[1]) {
            return true;
        }
    }
    return false;
}

function copiarNodo(nodo1, nodo2) { //copia la información del nodo 2 en el nodo 1
    var aux = [nodo2.estado[0], nodo2.estado[1]];
    nodo1.estado = aux;
    nodo1.nodoPadre = nodo2.nodoPadre;
    nodo1.solución = nodo2.solución;
}

function mostrarSolución(nodoSolución) {
    var nodoActual = new Nodo(null, null);
    copiarNodo(nodoActual, nodoSolución);
    var aux = []; //estados al revés
    console.log("inicia solución");
    while (nodoActual != null) {
        aux.push(nodoActual.estado);
        nodoActual = nodoActual.nodoPadre;
    }
    var estados = "";  //estados ordenados
    for (var i = 0; i < aux.length; i++) {
        estados = estados + " [" + aux[aux.length - 1 - i] + "]";
    }
    estados = estados + "\n";
    var p = document.createElement("p");
    document.body.appendChild(p);
    p.classList.add("texto");
    p.innerHTML = estados;
}

function sleep(ms) {
    console.log("sleep");
    return new Promise(resolve => setTimeout(resolve, ms));
}