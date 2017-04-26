const fetch = require('node-fetch');

export const convertExerciseIdToInt = (req, res, next) => {
    req.params.exerciseId = parseInt(req.params.exerciseId, 10);
    next();
};

function setHeaders(method, body, optHeader, authorization) {
    const headers = Object.assign(
        {
            'Content-Type': 'application/json; charset=utf-8',
        },
        optHeader,
    );

    if (authorization) {
        headers.Authorization = `Basic ${authorization}`;
    }

    return {
        method,
        headers,
        body,
    };
}

export async function postMultipart(url, uri) {
    const image = {
        uri: uri.path,
        type: 'image/jpeg',
        name: 'myImage' + '-' + Date.now() + '.jpg',
    };
    // Instantiate a FormData() object
    const imgBody = new FormData();
    // append the image to the object with the title 'image'
    imgBody.append('image', image);
    // Perform the request. Note the content type - very important
    const response = await fetch(baseURl + url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${authorization}`,
        },
        body: imgBody,
    });

    return _handleResponse(response);
}

export async function get(url, obj = {}) {
    const response = await fetch(_appUrl(url), setHeaders('GET'));

    return _handleResponse(response);
}

export async function post(url, obj, auth) {
    const response = await fetch(
        url,
        setHeaders('POST', JSON.stringify(obj), {}, auth),
    );
    return _handleResponse(response);
}

export async function del(url, obj) {
    const response = await fetch(
        _appUrl(url),
        setHeaders('DELETE', JSON.stringify(obj)),
    );
    return _handleResponse(response);
}

export async function put(url, obj) {
    const response = await fetch(
        _appUrl(url),
        setHeaders('PUT', JSON.stringify(obj)),
    );

    return _handleResponse(response);
}

const _handleResponse = async response => {
    if (response.status === 201 || response.status === 204) return;

    const responseJson = await response.json();

    if (response.status >= 400) {
        const msg = responseJson.msg || responseJson.message;
        console.log('error in fetch', responseJson);
        throw {
            message: msg,
        };
    }

    return responseJson;
};
