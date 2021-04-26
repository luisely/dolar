import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import dateFormat from 'dateformat'
import { GetStaticProps } from 'next'

const siteTitle = 'Valor Dolar'

export const getStaticProps: GetStaticProps  = async (context) => {
    var now = new Date()
    now = dateFormat(now, 'mm-dd-yyyy')

    try {
        const [dolarCompraRes, dolarRes] = await Promise.all([
            fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='01-01-2021'&@dataFinalCotacao='${now}'&$top=100&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`),
            fetch(`https://economia.awesomeapi.com.br/last/USD-BRL`)
        ]);

        const [dolarCompra, dolarAtual] = await Promise.all([
            dolarCompraRes.json(),
            dolarRes.json()
        ]);

        return {
            props: {
                dolarCompra,
                dolarAtual
            },
            revalidate: 60
        }
    } catch {
        return {
            props: {}
        }
    }
}



function Home(props) {
    if (!props.dolarCompra) {
        return (
            <div>
                <h3 className={utilStyles.heading2Xl}> Erro ao carregar os dados! </h3>
            </div>
        )
    }

    var dataAtual = new Date()
    dataAtual = dateFormat(dataAtual, 'dd/mm/yyyy')

    var dolar: string = props.dolarAtual.USDBRL.bid;
    dolar = dolar.toString().substring(6,0)

    return (
        <div className="container">
            <Head>
                <title>{siteTitle}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />

                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content="Site rapido e minimalista com valor atual do Dolar PTAX " />
                <meta property="og-locale" content="pt_BR" />
                <meta property="og:site_name" content={siteTitle} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://dolar.vercel.app" />
                <meta property="og:image" content="https://dolar.vercel.app/images/dolar.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content="Site rapido e minimalista com valor atual do Dolar PTAX" />
                <meta name="twitter:image" content="https://dolar.vercel.app/images/dolar.jpg" />

                <meta name="apple-mobile-web-app-title" content={siteTitle} />
                <meta name="application-name" content={siteTitle} />
                <meta name="msapplication-TileColor" content="#2c6fda" />/
                <meta name="theme-color" content="#ffffff" />
            </Head>

            <main>
                <div>
                    <h3 className={utilStyles.heading2Xl}>{dataAtual} </h3>
                </div>

                <div className={utilStyles.grid}>
                    <div className={utilStyles.card}>
                        <h3>Dolar</h3>
                        <p>R$ {dolar}</p>
                    </div>

                    <div className={utilStyles.card}>
                        <h3>PTAX Compra</h3>
                        <p>R$ {props.dolarCompra['value'][0].cotacaoCompra}</p>
                        <span></span>
                    </div>

                    <div className={utilStyles.card}>
                        <h3>PTAX Venda</h3>
                        <p> R$ {props.dolarCompra['value'][0].cotacaoVenda}</p>
                    </div>
                </div>

                <div>
                    <p>Valor dolar atualizado às {dateFormat(props.dolarAtual.USDBRL.create_date, 'dd-mm-yyyy HH:MM:ss')}  </p>
                </div>
            </main>

            <footer>
                <a href="https://github.com/luisely/dolar" target="_blank"> Criado por Fernando Ely</a>
            </footer>
        </div>
    )
}



export default Home
