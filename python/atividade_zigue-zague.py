numero = int(input())

inicio = 1
linha = 0

while inicio <= numero:
    fim = min(inicio + 9, numero)

    if linha % 2 == 0:
        print(*range(inicio, fim + 1))
    else:
        print(*range(fim, inicio - 1, -1))

    inicio = fim + 1
    linha += 1
