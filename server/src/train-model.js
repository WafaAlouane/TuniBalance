const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

// Sample Transactions Data
const data = [
  { montant: 100, type: 'Dépense', compte: 'Débit', mode_paiement: 'Espèces', statut: 'Validée' },
  { montant: 200, type: 'Recette', compte: 'Crédit', mode_paiement: 'Virement', statut: 'Validée' },
  { montant: 500, type: 'Dépense', compte: 'Débit', mode_paiement: 'Chèque', statut: 'En attente' },
  { montant: 1500, type: 'Recette', compte: 'Crédit', mode_paiement: 'Carte bancaire', statut: 'Validée' }
];

// Convert categorical data to numerical values
const preprocessData = (data) => {
  return data.map(d => ({
    montant: d.montant,
    type: d.type === 'Dépense' ? 1 : 0,
    compte: d.compte === 'Débit' ? 1 : 0,
    mode_paiement: d.mode_paiement === 'Espèces' ? 1 : 0,
    statut: d.statut === 'Validée' ? 1 : 0
  }));
};

// Prepare training data
const processedData = preprocessData(data);
const inputs = processedData.map(d => [d.montant, d.type, d.compte, d.mode_paiement, d.statut]);
const labels = processedData.map(d => [d.compte, 1 - d.compte]); // 1 for Debit, 0 for Credit

// Define a model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [inputs[0].length] }));
model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));

// Compile the model
model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

// Convert inputs and labels to tensors
const inputTensor = tf.tensor2d(inputs);
const labelTensor = tf.tensor2d(labels);

// Train the model
model.fit(inputTensor, labelTensor, { epochs: 50 }).then(async () => {
  console.log('Model training complete');

  // Save the model
  await model.save('file://./model');
  console.log('Model saved successfully');
});
