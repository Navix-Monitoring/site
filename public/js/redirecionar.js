function redirecionar() {
    if (sessionStorage.fkCargo == 3) {
        window.location = "../perfil-visualizar.html"
    }
    else if (sessionStorage.fkCargo == 2) {
        window.location = "../perfil-visualizar.html"
    }
    else if (sessionStorage.fkCargo == 1) {
        window.location = "../dashboard/dashboardAdmin.html"
    }
}

