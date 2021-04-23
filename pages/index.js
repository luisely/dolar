import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import dateFormat from 'dateformat'

export async function getServerSideProps(context){
    var now = new Date()
    now = dateFormat(now, 'mm-dd-yyyy')
    const res = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${now}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda`)
    const json = await res.json()
    now = dateFormat(now, 'dd/mm/yyyy')
    return { 
            props: {
                value: json['value'][0].cotacaoCompra, 
                value2: json['value'][0].cotacaoVenda,
                dateHoje: now
            }
    }
}

function Home(props) {
    return (
        <div className="container">
            <Head>
                <title>Valor Dolar</title>
            </Head>

            <main>
                <h2 className={utilStyles.heading2Xl}>Dolar PTAX - {props.dateHoje}</h2>
                <div>
                    <h3 className={utilStyles.headingLg}>Compra: R$ {props.value} </h3>
                </div>
                <div>   
                    <h3 className={utilStyles.headingLg}>Venda: R$ {props.value2}</h3>
                </div>

            </main>

            <footer>
                <a href="https://github.com/luisely/dolar" target="_blank" rel="noopener noreferrer"> Criado por Fernando Ely</a>
            </footer>
        </div>
    )
}



export default Home
