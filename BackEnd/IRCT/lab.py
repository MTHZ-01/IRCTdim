import subprocess


def get_dns_servers(domain):
    try:
        # استفاده از nslookup به جای dig
        result = subprocess.run(
            ["nslookup", "-type=NS", domain], capture_output=True, text=True
        )
        output = result.stdout

        print(f"DNS Servers for {domain}:")
        print(output)

    except Exception as e:
        print(f"Error: {e}")
   

# تست روی یک دامنه
domain = "guilan.ac.ir"
get_dns_servers(domain)
