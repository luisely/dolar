import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import { GetServerSideProps } from 'next'
import pt_BR from 'date-fns/locale/pt-BR'
import { api, apiDolar } from '../services/api'
import {format, parseISO } from 'date-fns'
import { useState } from 'react'

const siteTitle = 'Valor Dolar'

type VariacaoDolarDiario = {
    bid: string,
    ask: string
}

type Cotacoes = {
    cotacaoCompra: Number;
    cotacaoVenda: Number;
    dia_atualizado: String;
}

type HomeProps = {
    dolarVariacaoDiaria: VariacaoDolarDiario[];
    cotacaoDolar: Cotacoes[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const currentDate = format(new Date(), 'MM-dd-yyyy')

    try {
        const reqApiPTAX = await api.get(`versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='04-27-2021'&@dataFinalCotacao='${currentDate}'&$top=2&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`)
        const reqApiDolar = await apiDolar.get(`last/USD-BRL`)
        
        //Ajusta os dados do dolar PTAX
        const cotacaoDolar = [reqApiPTAX.data].map(valores => {
            return {
                cotacaoCompra: valores.value[0].cotacaoCompra,
                cotacaoVenda: valores.value[0].cotacaoVenda,
                dia_atualizado: format(parseISO(valores.value[0].dataHoraCotacao), 'd MMMM yyyy HH:mm:ss', {
                    locale: pt_BR
                })
            } 
        })
        
        //console.log(cotacaoDolar)
        //Ajusta os dados da variação do dolar
        const dolarVariacaoDiaria = [reqApiDolar.data].map(variacao => {
            return {
                bid: variacao.USDBRL.bid,
                ask: variacao.USDBRL.ask
            }
        })
        return {
            props: {
                cotacaoDolar,
                dolarVariacaoDiaria
            }
        }
    } catch {
        return {
            props: {}
        }
    }
}



function Home({ cotacaoDolar, dolarVariacaoDiaria }: HomeProps ){
    if (!cotacaoDolar)  {
        return (
            <main>
                <div> 
                    <h3 className={utilStyles.heading2Xl}> Erro ao carregar os dados. </h3>
                </div>
            </main>
        )
    }


    const [bid, setBid] = useState(dolarVariacaoDiaria[0].bid);
    const [cotacaoCompra, setCotacaoCompra] = useState(cotacaoDolar[0].cotacaoCompra );
    const [cotacaoVenda, setCotacaoVenda] = useState(cotacaoDolar[0].cotacaoVenda );

    const dataAtual = format(new Date(), 'dd/MM/yyyy', {
        locale: pt_BR,
    })

    // var dolar: string = props.dolarAtual.USDBRL.bid;
    // dolar = dolar.toString().substring(6,0)

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
                    <h3 className={utilStyles.heading2Xl}>{ dataAtual} </h3>
                </div>
                <div className={utilStyles.grid}>
                    <div className={utilStyles.card}>
                        <h3>Dolar</h3>
                        <p>R$ { bid }</p>
                    </div>
                    <div className={utilStyles.card}>
                        <h3>PTAX Compra</h3>
                        <p>R$ { cotacaoCompra } </p>
                    </div>

                    <div className={utilStyles.card}>
                        <h3>PTAX Venda</h3>
                        <p> R$ { cotacaoVenda } </p>
                    </div>
                </div>

                <p></p>

                <div>
                    <p>Ultima atualização: { cotacaoDolar[0].dia_atualizado }</p>
                </div>
            </main>

            <footer>
                <a href="https://github.com/luisely/dolar" target="_blank"> Criado por Fernando Ely</a>
            </footer>
        </div>
    )
}



export default Home
