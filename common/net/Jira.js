const { get } = require("lodash");

const serviceName = "jira";
const { format } = require("url");
const client = require("./client")(serviceName);

class Jira {
	constructor({ baseUrl, token, email }) {
		this.baseUrl = baseUrl;
		this.token = token;
		this.email = email;
	}

	async addComment(issueId, data) {
		return this.fetch(
			"addComment",
			{
				pathname: `/rest/api/2/issue/${issueId}/comment`,
			},
			{
				method: "POST",
				body: data,
			}
		);
	}

	async updateField(issueId, data) {
		try {
			const array = data.split(',');
      const parsedData = array.reduce((newData, item) => {
        const splitItem = item.split('::');
        if (splitItem.length === 2) {
          newData[splitItem[0].trim()] = splitItem[1];
        }
        return newData;
      }, {});
			return this.fetch(
				"updateField",
				{
					pathname: `/rest/api/2/issue/${issueId}`,
				},
				{
					method: "PUT",
					body: {
            fields: parsedData
          },
				},
        true
			);
		} catch (err) {
			throw err;
		}
	}

	async createIssue(body) {
		return this.fetch(
			"createIssue",
			{ pathname: "/rest/api/2/issue" },
			{ method: "POST", body }
		);
	}

	async getIssue(issueId, query = {}) {
		const { fields = [], expand = [] } = query;

		try {
			return this.fetch('getIssue', {
				pathname: `/rest/api/2/issue/${issueId}`,
				query: {
					fields: fields.join(','),
					expand: expand.join(','),
				},
			});
		} catch (error) {
			if (get(error, 'res.status') === 404) {
				return;
			}

			throw error;
		}
	}

	async getIssueTransitions(issueId) {
		return this.fetch(
			'getIssueTransitions',
			{
				pathname: `/rest/api/2/issue/${issueId}/transitions`,
			},
			{
				method: 'GET',
			}
		);
	}

	async transitionIssue(issueId, data) {
		return this.fetch(
			'transitionIssue',
			{
				pathname: `/rest/api/3/issue/${issueId}/transitions`,
			},
			{
				method: 'POST',
				body: data,
			}
		);
	}

	async fetch(
		apiMethodName,
		{ host, pathname, query },
		{ method, body, headers = {} } = {},
    skipStringify
	) {
		const url = format({
			host: host || this.baseUrl,
			pathname,
			query,
		});

		if (!method) {
			method = 'GET';
		}

		if (headers['Content-Type'] === undefined) {
			headers['Content-Type'] = 'application/json';
		}

		if (headers.Authorization === undefined) {
			headers.Authorization = `Basic ${Buffer.from(
				`${this.email}:${this.token}`
			).toString('base64')}`;
		}

		// strong check for undefined
		// cause body variable can be 'false' boolean value
		if (body && headers['Content-Type'] === "application/json" && !skipStringify) {
			body = JSON.stringify(body);
		}

		const state = {
			req: {
				method,
				headers,
				body,
				url,
			},
		};

		try {
      console.log('request:', state.req.body)
			await client(state, `${serviceName}:${apiMethodName}`);
		} catch (error) {
			const fields = {
				originError: error,
				source: "jira",
			};

			delete state.req.headers;
      const formattedError = Object.assign(new Error("Jira API error"), state.res.body.errorMessages, fields);

      console.log('#### error', JSON.stringify(formattedError))

			throw formattedError;
		}

		return state.res.body;
	}
}

module.exports = Jira;
