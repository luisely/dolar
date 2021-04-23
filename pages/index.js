import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import dateFormat from 'dateformat'

function Home({ value, value2, dateHoje}) {
    return (
        <div className="container">
            <Head>
                <title>Valor Dolar</title>
            </Head>

            <main>
                <h1 className={utilStyles.heading2Xl}>Dolar Hoje {dateHoje}</h1>
                <h3 className={utilStyles.headingLg}>Compra: R$ {value} </h3>
                <h3 className={utilStyles.headingLg}>Venda: R$ {value2}</h3>
            </main>

            <footer>
                <a href="https://github.com/luisely" target="_blank" rel="noopener noreferrer"> Criado por Fernando Ely</a>
            </footer>
        </div>
    )
}

Home.getInitialProps = async (ctx) => {
    var now = new Date()
    now = dateFormat(now, 'mm-dd-yyyy')
    const res = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${now}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda`)
    const json = await res.json()
    now = dateFormat(now, 'dd/mm/yyyy')
    return { 
        value: json['value'][0].cotacaoCompra, 
        value2: json['value'][0].cotacaoVenda,
        dateHoje: now
    }
}

export default Home
