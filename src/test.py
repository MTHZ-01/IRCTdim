from openai import OpenAI

# This client can be used for other model providers
# as well, like google, anthropic, etc..
client = OpenAI(
    api_key="sk-WsXzBbwaBDyjCBdwutzj3wnTW7qw7szKdZ83IUJHMn2JJJ5H",
    base_url="https://api.gapgpt.app/v1"
)

response = client.responses.create(
    model="gapgpt-qwen-3.5",
    input="how would you like the position of humans in sport?"
)

print(response.output_text)