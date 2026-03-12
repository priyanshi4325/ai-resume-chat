from chat_engine import ask_resume

while True:

    q = input("Ask about resume: ")

    if q == "exit":
        break

    ans = ask_resume(q)

    print("\nAnswer:", ans)