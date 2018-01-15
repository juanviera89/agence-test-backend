function calculateRelatorios(data){

    /* Funcion para
    Calcular los relatorios mensuales de cada usuario, devolviendo un objeto en el que por cada usuario,
    hay un año, por cada año un mes, y por cada mes hay receita liquita, costo fijo, comision y lucro
     */

    let relatorio = {};
    
    console.log('calculando relatorios');
    for (const _row of data) {

        let rowDate = new Date(_row.data_emissao);
        //console.log('fecha');
        //console.log(rowDate);
        // initialize keys of relatorio for each user, year and month found on results
        if (! relatorio.hasOwnProperty(_row.co_usuario)) {
            relatorio[_row.co_usuario] = {}
            //console.log('se encontro nuevo usuario: ' + _row.co_usuario);
        }
        if (! relatorio[_row.co_usuario].hasOwnProperty(rowDate.getFullYear().toString())) {
            relatorio[_row.co_usuario][rowDate.getFullYear().toString()] = {}
            //console.log('se encontro nuevo año: ' + rowDate.getFullYear().toString());
        } // No se inicializa el mes cuando se ecnuentra un año nuevo puesto que si el año ya exite pero se encuentra
        // un nuevo mes, el mismo debe ser inicializado, lo que implica la misma inicializacion para ambos casos
        if (!  relatorio[_row.co_usuario][rowDate.getFullYear().toString()].hasOwnProperty(rowDate.getMonth().toString())) {
            //console.log('se encontro nuevo mes: ' + rowDate.getMonth().toString());
            relatorio[_row.co_usuario][rowDate.getFullYear().toString()][rowDate.getMonth().toString()] = {
                receitaLiquida : 0,
                custoFijo : _row.brut_salario, // se inicializa con valor ya que todo el mes se mantiene con el mismo valor
                comissao : 0,
                lucro : -1 * _row.brut_salario // se resta de una vez ya que el costo fijo es unico mensualmente, no se debe restar por cada OS
            }
        }
        // ------------------------------------------------------------------------

        

        let OS = _row.valor*(1 - _row.total_imp_inc/100);
        let comissao = OS*_row.comissao_cn/100;
        let lucro = OS - comissao;

        
        let relatorioTemp = relatorio[_row.co_usuario][rowDate.getFullYear().toString()][rowDate.getMonth().toString()]

        relatorioTemp.receitaLiquida = relatorioTemp.receitaLiquida + OS;
        relatorioTemp.comissao = relatorioTemp.comissao + comissao;
        relatorioTemp.lucro = relatorioTemp.lucro + lucro;

    }

    return relatorio;
}

const usuarios = {
    
        getNames (req,res,mySQLConnection) {
            console.log('Solicitando consultores');
            //console.log(mySQLConnection);
    
            let query = 'SELECT `cao_usuario`.`co_usuario`,`no_usuario` FROM `permissao_sistema` RIGHT JOIN `cao_usuario` ON `permissao_sistema`.`co_usuario` = `cao_usuario`.`co_usuario` WHERE `co_sistema` = 1 AND `in_ativo` = "S" AND `co_tipo_usuario` IN (0,1,2)' 
            mySQLConnection.query(query, function (error, results, fields) {
                if (error != null) 
                {   
                    throw error;
                // ...
                    console.log('Error en SQL query: ' + error);
                    res.status(500).json({
                        success : false,
                        message : 'Internal Server Error'
                    });
                    return res.end();
    
                }
                
    
                console.log(results);

                if (results== null || results.length == 0){
                    res.status(404).json({
                        success: false,
                        message: 'no results'
                      })
                      return res.end();
                    
                }

                res.status(200).json({
                    success: true,
                    body: results
                  })
                  return res.end();
                });
        },
        
        getRelatorio(req,res,mySQLConnection) {
            try {
                console.log('solicitando receitas');
                //console.log(mySQLConnection);
        
                //console.log(req);

                // ###################### 
                // request body must have the follow structure:
                // {
                //     "co_usuario" : [co_usuario keys (string)],
                //     "dates" : {
                //         "init" : {
                //             "year" : start year (number),
                //             "month" : start month(number)
                //         },
                //         "end" : {
                //             "year" : end year (number),
                //             "month" : end month(number)
                //         }
                //     }
                // }
                // ###################### 

                // ###############################
                // Se anexan al query tantos signos de escape como cantidad de usuarios 
                // se soliciten en el request
                let scapeSigns = '';

                let _arrSigns = []
                for (const value in req.body.co_usuario) {
                    // Por cada usuario se agrega un simbolo de escape
                    _arrSigns.push('?');
                }
                scapeSigns = _arrSigns.join(','); 
                // el query es un string, por lo que el array se comvierte en string previamente
                //y por ultimo se arma el query
                let query = 'SELECT cao_fatura.data_emissao, cao_salario.brut_salario, cao_fatura.valor, cao_fatura.total_imp_inc, cao_fatura.comissao_cn, cao_os.co_usuario FROM cao_os JOIN cao_fatura ON cao_fatura.co_os = cao_os.co_os JOIN cao_salario ON cao_salario.co_usuario = cao_os.co_usuario WHERE cao_os.co_usuario IN ('+ scapeSigns +') AND (cao_fatura.data_emissao BETWEEN ? AND ?)' 
                // el query une 3 tablas para obtener todos los datos necesarios para calcular los relatorios

                //################################


                // ############################################
                // grouping all values to be used in query by scaping
                let values = req.body.co_usuario;

                let _date = new Date();
                _date.setFullYear(req.body.dates.init.year);
                _date.setDate(1);
                _date.setMonth(req.body.dates.init.month);

                let dateString = _date.toISOString().substr(0,10) + " 00:00:00";

                values.push(dateString);
                
                _date.setFullYear(req.body.dates.end.year);
                _date.setMonth(req.body.dates.end.month + 1); // next month to get the previous day to that month
                _date.setDate(0);
                dateString = _date.toISOString().substr(0,10) + " 23:59:59";

                values.push(dateString);

                console.log('condiciones a buscar: ' + values.join(","))
                // #################################################


                mySQLConnection.query({
                    sql: query,
                    timeout: 40000, // 40s
                    values: values
                    }, function (error, results, fields) {
                    if (error != null) 
                    {   
                        throw error;
                    // ...
                        console.log('Error en SQL query: ' + error);
                        res.status(500).json({
                            success : false,
                            message : 'Internal Server Error'
                        });
                        return res.end();
        
                    }

                    let relatorio = calculateRelatorios(results);
                    

                    //console.log(results);
                    res.status(200).json({
                        success: true,
                        relatorio : relatorio
                        // , consulta : results
                        })
                        return res.end();
                    });
                } catch(err){
                    console.log(err);
                    res.status(400);
                    return res.end();

                }
        }
        
    }
    
    module.exports = usuarios;