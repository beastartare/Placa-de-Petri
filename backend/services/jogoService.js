function evoluirGrade(grade) {
    const tam = grade.length;

    const proximaGrade = Array.from(
        { length: tam },
        () => Array(tam).fill(false)
    );

    for (let linha = 0; linha < tam; linha++) {
        for (let coluna = 0; coluna < tam; coluna++) {
            let vizinhasVivas = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;

                    const vizinhaLinha = linha + i;
                    const vizinhaColuna = coluna + j;

                    if (vizinhaLinha >= 0 && vizinhaLinha < tam &&
                        vizinhaColuna >= 0 && vizinhaColuna < tam) {
                        if (grade[vizinhaLinha][vizinhaColuna]) {
                            vizinhasVivas++;
                        }
                    }
                }
            }

            const celulaViva = grade[linha][coluna];

            if (celulaViva) {
                if (vizinhasVivas === 2 || vizinhasVivas === 3) {
                    proximaGrade[linha][coluna] = true;
                }
            } else {
                if (vizinhasVivas === 3) {
                    proximaGrade[linha][coluna] = true;
                }
            }
        }
    }
    return proximaGrade;
}

module.exports = {
    evoluirGrade,
};