export type Method = "GET" | "POST" | "PUT";

export function parseHash(link: string): any {
	let query = link;
	let result: any = {};
	query.split("&").forEach((part) => {
		let item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

export function capitalize(s: string): string {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export function asURL(obj: any): string {
	return Object.keys(obj).map(k => {
		if (k !== 'headers') {
			return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
		}
	})
	.join('&')
	.replace(/\s/gmui, '%20');
}

export function request(method: Method, url: string, params: any): Promise<any> {
	return new Promise((resolve, reject) => {
		let xmlHttp = new XMLHttpRequest();
		xmlHttp.open(method, url, true);
		xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xmlHttp.setRequestHeader('Accept', 'application/json');
		for (let key in params.headers) {
			xmlHttp.setRequestHeader(key, params.headers[key]);
		}
		xmlHttp.onreadystatechange = () => {
			if (xmlHttp.readyState === 4) {
				if (xmlHttp.status === 200) {
					resolve(xmlHttp.responseText);
				}
				else {
					console.log(xmlHttp)
					reject(`${xmlHttp.status}: ${xmlHttp.statusText}`);
				}
			}
		};
		xmlHttp.send(asURL(params).replace(/^&/gmui, ''));
	});
}