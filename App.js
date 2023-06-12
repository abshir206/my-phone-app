import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

export default function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [card, setCard] = useState(null);

  const handleCreateCard = () => {
    setCard({ question, answer });
    setQuestion('');
    setAnswer('');
  };

  return (
    <View>
      <TextInput
        placeholder="Enter a question"
        value={question}
        onChangeText={text => setQuestion(text)}
      />
      <TextInput
        placeholder="Enter the answer"
        value={answer}
        onChangeText={text => setAnswer(text)}
      />
      <Button title="Create Card" onPress={handleCreateCard} />
      {card && (
        <View>
          <Text>Question: {card.question}</Text>
          <Text>Answer: {card.answer}</Text>
          <Text>Nora is so pretty</Text>
        </View>
      )}
    </View>
  );
}