with open('.\\input.txt', 'r') as file:
    content = [line.strip() for line in file.readlines() if line.strip()]

# return the last value of each processed sequence, since thats all i need
def getLastDifferences(sequence):
    lastDifferences = []

    while True:
        newSequence = []

        for i in range(len(sequence) - 1):
            newSequence.append(sequence[i+1] - sequence[i])

        lastDifferences.append(newSequence[-1])
        sequence = newSequence

        if sum(sequence) == 0:
            return sum(lastDifferences);


history = []

for line in content:
    sequence = [int(v) for v in line.split()]

    diff = getLastDifferences(sequence) + sequence[-1]
    history.append(diff)


print(sum(history))