const formulario = document.querySelector('#agregar-gasto')
const listaGastos = document.querySelector('#gastos ul')  //.list-group??


eventListeners()
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGasto)
}

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }


    nuevoGasto(gasto){
       this.gastos = [...this.gastos, gasto]
       this.calcularRestante()
    console.log(this.gastos)
    } 

    calcularRestante(){
    const gastado = this.gastos.reduce((total,gasto)=> total + Number(gasto.cantidad),0)
    this.restante = this.presupuesto -gastado
   
    }

    eliminarGasto(id){
       this.gastos = this.gastos.filter(gasto=> gasto.id  !== id)
       console.log(this.gastos)
       this.calcularRestante()
    }

}

class UI{
    insertarPresupuesto (cantidad) {
        //deconstructor
        const {presupuesto, restante} = cantidad

        //se extrae nodo donde colocar info y se agrega contenido
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje, tipo){
        // crea div 
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert') // se  agregan clases de bootstrap 

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')  // agrega clase bootstrap en rojo 
        }else{
            divMensaje.classList.add('alert-success')  //
        }

        divMensaje.textContent = mensaje 

        // se inserta dentro de nodo clase .primario

        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        // borrar divmensaje despues 3 s

        setTimeout(()=>{
            divMensaje.remove()
        },3000)

      
    }


    
    agregarGastoListado(gastos){
        
        //se itera sobre arreglo de gastos
            this.limpiarHTML() // elimna HTML previo 
            gastos.forEach((gasto)=>{
            const {cantidad, nombre, id} = gasto


            // se crea LI
            const  nuevoGasto = document.createElement('li')
            //clases de formato
            nuevoGasto.className = 'list-group-item d-flex align-items-center'
            //se le agrega id con dataset
            nuevoGasto.dataset.id = id

            // SE AGREGA EL HTML DE GASTO
            nuevoGasto.innerHTML = `
            ${nombre}  ${cantidad}
            `

            //BOTON DE BORRAR
            const btnborrar = document.createElement ('button')
            //se agregan clases bootstrap
            btnborrar.className = 'btn btn-sdanger borrar-gasto'
            btnborrar.innerHTML = 'Borrar &times;'
            btnborrar.onclick=()=>{
                    eliminarGasto(id)
            }

            // SE AGREGA  A NUEVO GASTO
            nuevoGasto.appendChild(btnborrar)
            listaGastos.appendChild(nuevoGasto)
        })
    }

    limpiarHTML(){
        while(listaGastos.firstChild){
            listaGastos.removeChild(listaGastos.firstChild)

        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante
       
    }

    comprobarPresupuesto(presupuestoObt){
        const {presupuesto,restante} = presupuestoObt
        const restanteDiv= document.querySelector('.restante')
        if((presupuesto/4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        }else if ((presupuesto/2)>restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-warning','alert-danger' )
            restanteDiv.classList.add('alert-success')
        }


        if (restante <= 0){
            ui.imprimirAlerta('Presupuesto agotado', 'error')
            //desactivar boton
            formulario.querySelector('button[type="submit"]').disabled=true
        }
    }


}

//instancia ui
const ui = new UI()
let presupuesto;

function preguntarPresupuesto ()
{
    const presupuestoUsusario = prompt('¿Cual es tu presupuesto?')
    
    if (presupuestoUsusario ==='' || presupuestoUsusario === null || isNaN(presupuestoUsusario)){
        window.location.reload()
    }
     presupuesto = new Presupuesto(presupuestoUsusario) 
     

     ui.insertarPresupuesto(presupuesto)
}

function  agregarGasto(e){
    e.preventDefault();
    // se selecciona el valor de los inputs 
    const nombre= document.querySelector('#gasto').value
    const cantidad = document.querySelector('#cantidad').value

    // se verifica si fueron llenados ambos

    if (nombre==='' || cantidad ===''){
        ui.imprimirAlerta('Todos los campos son obligatios', 'error')
    }else if 
        (isNaN(cantidad) || cantidad <= 0){
        ui.imprimirAlerta('Cantidad incorrecta', 'error')
    }else{
        const gasto = {nombre, cantidad, id: Date.now()} 
        presupuesto.nuevoGasto(gasto)
        ui.imprimirAlerta('Gasto agregado correctamente')

        //IMPRIMIR GATOS 
        
        const {gastos,restante} = presupuesto // deconstructor para solo pasar gastos 
       ui.agregarGastoListado(gastos)
        console.log(restante)
        ui.actualizarRestante(restante)
        ui.comprobarPresupuesto(presupuesto)
        formulario.reset()
    }



}

function eliminarGasto(id){
    
    presupuesto.eliminarGasto(id)
  


    //elimina de HTML

   const  {gastos,restante} = presupuesto
    ui.agregarGastoListado(gastos)


    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}