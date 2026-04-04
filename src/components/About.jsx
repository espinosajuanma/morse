import React from 'react';

function About({ onBack }) {
  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Acerca de</h2>
        <button className="btn-secondary" onClick={onBack}>Volver</button>
      </div>
      <div>
        <h3>Misión</h3>
        <p>
            <strong class="brand">MORSE</strong> es una plataforma de código abierto dedicada a la
            preservación y enseñanza de la telegrafía (CW). El objetivo es
            proporcionar una herramienta técnica y gratuita para que
            radioaficionados y entusiastas puedan dominar el código
            Morse de manera ágil y moderna.
        </p>

        <h3>Contribuciones</h3>
        <p>
            Este es un proyecto sin fines de lucro y de código abierto.
        </p>
        <p><strong>GitHub:</strong> <a href="https://github.com/espinosajuanma/morse" target="_blank" rel="noopener noreferrer">https://github.com/espinosajuanma/morse</a></p>
        <h3>Juanma Espinosa</h3>
        <ul>
            <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/espinosajuanma" target="_blank" rel="noopener noreferrer">https://linkedin.com/in/espinosajuanma</a></li>
            <li><strong>Email:</strong> <a href="mailto:hola@juanma.ar">hola@juanma.ar</a></li>
            <li><strong>Website:</strong> <a href="https://juanma.ar" target="_blank" rel="noopener noreferrer">https://juanma.ar</a></li>
        </ul>
      </div>
    </div>
  );
}

export default About;