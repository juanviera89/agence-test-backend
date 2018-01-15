*************************************************************************************
**** Back-end de Test Practico de Agence.br desarrollado en Node.js y Express *******
*************************************************************************************

dependencies:
    Express
    body-parser
    Mysql

Structure:

    indice.js
        |- bootstrap
            |- connection (MySQL connection)
                |- routes ( End Point definitions)
                    |- controllers* (functions to handle http requests)

End Points:

    GET 
        /api/consultores
            Devuelve un array de objetos con los id y nombre de usuarios con permisos para consultar
    POST
        /api/relatorio
            Toma como parametro un objeto con la siguiente estructura:
                {
                     "co_usuario" : [co_usuario keys (string)],
                     "dates" : {
                         "init" : {
                             "year" : start year (number),
                             "month" : start month(number)
                         },
                         "end" : {
                             "year" : end year (number),
                             "month" : end month(number)
                         }
                     }
                 }
            Devuelve un objeto con los relatorios de cada mes y años existentes para cada usuario especificado dentro de los parametros recibidos en el rango de fechas establecidos

*************************************************************************************
************************ Desarrollado por Juan Viera  *******************************
*************************************************************************************