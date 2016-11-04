'use strict';

const cleanStack = require('clean-stack');
const VError = require('verror');

function wrapInQuotesOrEmpty (key, value) {
    if (!value) {
        return '';
    }

    return `,"${key}":"${value}"`;
}

function wrapInQuotesOrNull (value) {
    if (!value) {
        return null;
    }

    return `"${value}"`;
}

function createMessage (level, message, error, data, moduleName, file, topLevelApp) { // eslint-disable-line max-params
    const ensuredMessage = message || null;
    const messageIsError = ensuredMessage instanceof Error;
    const localError = messageIsError ? ensuredMessage : error;
    let localData = messageIsError ? error : data;
    const localErrorIsError = localError instanceof Error;
    const messageString = JSON.stringify(messageIsError ? ensuredMessage.toString() : ensuredMessage);
    const errorIsData = localError != null && !localErrorIsError;
    localData = errorIsData ? error : (localData || {});

    const stacktrace = localErrorIsError ? JSON.stringify(cleanStack(VError.fullStack(localError))) : null;

    const throwable = stacktrace ? `,"throwable":${stacktrace}` : '';
    const logger = wrapInQuotesOrEmpty('logger', localData.logger);
    const clientIp = wrapInQuotesOrEmpty('client_ip', localData.clientIp);
    const userId = wrapInQuotesOrEmpty('user_id', localData.userId);
    const adId = wrapInQuotesOrEmpty('ad_id', localData.adId);
    const fruitsApp = wrapInQuotesOrEmpty('fruits_app', localData.fruitsApp || topLevelApp);
    const extras = localData.extras == null ? '' : `,"extras":${JSON.stringify(localData.extras)}`;

    return `{"@version": 1,"@timestamp":"${new Date().toISOString()}"${logger},"level":"${level}","message":${messageString}${throwable}${fruitsApp}${clientIp}${userId}${adId},"LocationInfo":{"file":${wrapInQuotesOrNull(file)},"module":${wrapInQuotesOrNull(moduleName)}}${extras}}`; // eslint-disable-line max-len
}

module.exports = createMessage;
