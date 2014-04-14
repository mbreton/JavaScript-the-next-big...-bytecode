/*
 Interface for the AJAX setting that will configure the AJAX request
 */
interface JQueryAjaxSettings {
    accepts?: any;
    async?: boolean;
    beforeSend? (jqXHR:JQueryXHR, settings:JQueryAjaxSettings): any;
    cache?: boolean;
    complete? (jqXHR:JQueryXHR, textStatus:string): any;
    contents?: { [key: string]: any; };
    contentType?: any;
    context?: any;
    converters?: { [key: string]: any; };
    crossDomain?: boolean;
    data?: any;
    dataFilter? (data:any, ty:any): any;
    dataType?: string;
    error? (jqXHR:JQueryXHR, textStatus:string, errorThrow:string): any;
    global?: boolean;
    headers?: { [key: string]: any; };
    ifModified?: boolean;
    isLocal?: boolean;
    jsonp?: string;
    jsonpCallback?: any;
    mimeType?: string;
    password?: string;
    processData?: boolean;
    scriptCharset?: string;
    statusCode?: { [key: string]: any; };
    success? (data:any, textStatus:string, jqXHR:JQueryXHR): any;
    timeout?: number;
    traditional?: boolean;
    type?: string;
    url?: string;
    username?: string;
    xhr?: any;
    xhrFields?: { [key: string]: any; };
}