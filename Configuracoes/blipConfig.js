const blipConfig = {
    keyRouter: process.env.blipKeyRouter || 'Key =',
    namespace: process.env.blipNamespace || '',
    urlEnvioMensagemAtiva: process.env.blipUrlEnvioMensagemAtiva || '',
    urlRealizarComando: process.env.blipUrlRealizarComando || '',
    proativa: process.env.proativa || '',
    reativa: process.env.reativa || ''
}


module.exports = {
    blipConfig
}