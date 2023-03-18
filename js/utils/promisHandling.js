const restUrl = "http://localhost:8080/"

function createRequest(method, entity) {
    return {
        method: method,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(entity)
    }
}


function fetchResponse(url, request) {
    return fetch(url, request).catch((error) => {
        console.log(`ERROR: ${error}. Tried to fetch response from URL: '${url}' using Request:`, request)
        return fetch(url, request)

    })
}

function fetchAnyJson(url) {
    return fetch(url).then((response) => response.json().catch((error) => {
        console.log(`ERROR: ${error}. Tried to make the resulting response from the URL '${url}' in to JSON, 'Response':`, response)
        return fetch(url).then((response) => response.json())
    })).catch(error => {
        console.log(`Tried to fetch data from the URL '${url}'. Which gave 'Error':`, error)
        return fetch(url)
    })
}


async function getAnyEntities(url) {
    const entityList = []
    const promise = await fetchAnyJson(url)
    console.log(promise)
    promise.forEach(entity => { entityList.push(entity) })
    return entityList
}

function getLocalEntity(entityClassName, entityID) {
    const restGetUrl = restUrl + entityClassName + "/" + entityID
    return fetchAnyJson(restGetUrl)
}

function getLocalEntityAttribute(entityClassName, entityID, attributeName) {
    const restGetUrl = restUrl + entityClassName + "/" + entityID + "/" + attributeName
    return fetchAnyJson(restGetUrl)
}

function getLocalEntities(entitiesClassName) {
    const entitiesLocalUrl = restUrl + entitiesClassName
    return getAnyEntities(entitiesLocalUrl)
}

async function postLocalEntity(entityClassName, entity) {
    const restPostUrl = restUrl + entityClassName
    const postRequest = createRequest("POST", entity)
    const postResponse = await fetchResponse(restPostUrl, postRequest)
    console.log(`Posting, to the url: '${restPostUrl}', a/an '${entityClassName}':`, entity)
    if (postResponse.ok) {
        console.log(`It WAS accepted by URL '${restPostUrl}' to POST '${entityClassName}':`, entity)
        return true // meningen at det skal returne et response object som har data der i, hvis man har forskellige fejl at håndtere
    } else {
        console.log(`It was NOT accepted by URL '${restPostUrl}' to POST '${entityClassName}':`, entity)
        return false
    }
}

async function postLocalForm(url, plainFormData) {
    const postRequest = createRequest("POST", plainFormData)
    const postResponse = await fetchResponse(url, postRequest)
    console.log(`Posting, to the url: '${url}', a "Form':`, plainFormData)
    if (postResponse.ok) {
        console.log(`It WAS accepted by URL '${url}' to POST the form and save it, PostResponse:`, postResponse)
        return true // meningen at det skal returne et response object som har data der i, hvis man har forskellige fejl at håndtere
    } else {
        console.log(`It was NOT accepted by URL '${url}' to POST the form and save it, PostResponse:`, postResponse)
        return false
    }
}

function preparePlainFormData(form, extraPreparationMethod) {
    console.log("Form:", form)
    const formData = new FormData(form)
    console.log("FormData:", formData)
    const plainFormData = Object.fromEntries(formData.entries())
    console.log("PlainFormData:", plainFormData)
    extraPreparationMethod(plainFormData)
    return plainFormData
}

async function updateLocalEntity(entityClassName, entity, entityID) {
    const restUpdateUrl = restUrl + entityClassName + '/' + entityID
    const putRequest = createRequest("PUT", entity)
    const putResponse = await fetchResponse(restUpdateUrl, putRequest)
    console.log(`Updating a/an '${entityClassName}' with the ID of: '${entityID}'. To the url: '${restUpdateUrl}'`)
    if (putResponse.ok) {
        console.log(`It WAS accepted by URL '${restUpdateUrl}' to PUT (update) '${entityClassName}':`, entity)
        return true // meningen at det skal returne et response object som har data der i, hvis man har forskellige fejl at håndtere
    } else {
        console.log(`It NOT accepted by URL '${restUpdateUrl}' to PUT (update) '${entityClassName}':`, entity)
        return false
    }
}

async function deleteLocalEntity(entityClassName, entity, entityID) {
    const restDeleteUrl = restUrl + entityClassName + '/' + entityID
    const deleteRequest = createRequest("DELETE", entity)
    const deleteResponse = await fetchResponse(restDeleteUrl, deleteRequest)
    console.log(`Deleting a/an '${entityClassName}' with the ID of: '${entityID}'. To the url: '${restDeleteUrl}'`)
    if (deleteResponse.ok) {
        console.log(`It WAS accepted by URL '${restDeleteUrl}' to DELETE '${entityClassName}':`, entity)
        return true // meningen at det skal returne et response object som har data der i, hvis man har forskellige fejl at håndtere
    } else {
        console.log(`It was NOT accepted by URL '${restDeleteUrl}' to DELETE '${entityClassName}':`, entity)
        return false
    }
}