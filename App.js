import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';

export default function App() {
  const [contact, setContact] = useState(null);
  const [score, setScore] = useState(3);
  const [message, setMessage] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const messagesArray = ['I love you', 'Call me right now!', 'Can I borrow $20?', 'I lost the kids!', 'I am in jail!', 'I think we should see other people', 'I am pregnant', 'I think I might rob this bank', 'Send me a picture.', 'I quit my job just now.', 'You won\'t believe this but I am playing a dumb game right now and if I read all of this I won\'t get my points!'];


  useEffect(() => {
    let interval;
    if (contact) {
      const startTime = new Date().getTime();
      interval = setInterval(() => {
        const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000);
        setSecondsElapsed(elapsedTime);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [contact]);

  const getRandomContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const filteredContacts = data.filter(
        (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
      );

      const randomIndex = Math.floor(Math.random() * filteredContacts.length);
      const selectedContact = filteredContacts[randomIndex];

      setContact(selectedContact);
      setContactCount(contactCount + 1);

    }
    if (contactCount >= 5) {
      setMessage('You can no longer select a contact... Haha!');
    }
  };

  const sendMessage = async () => {
    setMessage('');
    setContactCount(0);

    if (contact) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
          [contact.phoneNumbers[0].number],
          messagesArray[Math.floor(Math.random() * messagesArray.length)]
        );
        if (result === 'sent') {
          if (secondsElapsed > 4) {
            setMessage('You took too long!');
            setScore(score - 1);
          } else {
            setScore(score + 1);
            setMessage(`Message sent successfully! It took ${secondsElapsed} seconds.`);
          }
        } else {
          if (secondsElapsed > 4) {
            setMessage('You took too long!');
            setScore(score - 1);
          } else {
            setScore(score - 1);
            setMessage(`Failed to send message after ${secondsElapsed} seconds.`);
          }
        }
      } else {
        setMessage('SMS is not available on this device');
      }
    } else {
      setMessage('Please select a contact before sending a message');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>YOLO Texter</Text>
      </View>

      {contact ? (
        <View style={styles.contact}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactPhone}>
            {contact.phoneNumbers[0].number}
          </Text>
        </View>
      ) : (
        <Text style={styles.noContact}>No contact selected</Text>
      )}

      <View style={styles.buttonsContainer}>
        <Button title="Select random contact" onPress={getRandomContact} disabled={contactCount >= 5}/>
        <View style={{ marginHorizontal: 10 }} />
        <Button title="Send message" onPress={sendMessage} disabled={!contact} />
      </View>

      {message !== '' && (
        <Text style={styles.message}>{message}</Text>
      )}

      <Text style={styles.score}>Score: {score}</Text>

      {score >= 10 && (
        <View>
          <Text style={styles.gameOver}>Congratulations, you won! But at what cost?</Text>
          <Button title="Reset" onPress={() => {
            setContact(null);
            setScore(3);
            setMessage('');
            setSecondsElapsed(0);
            setContactCount(0);
          }} />
        </View>
      )}

      {score <= 0 && (
        <View>
          <Text style={styles.gameOver}>Game over!</Text>
          <Button title="Reset" onPress={() => {
            setContact(null);
            setScore(3);
            setMessage('');
            setSecondsElapsed(0);
            setContactCount(0);
          }} />
        </View>
      )}
      <ScrollView style={styles.instructions}> 
        <Text style={styles.instructionText}>1. Press "Select Random Contact" to have a contact from your phone appear. Careful though... the button disables after hitting it 5 times and you will be stuck with that contact.</Text>
        <Text style={styles.instructionText}>2. Press "Send Message" to send a random message to the contact. If you take more than 4 seconds to send the message or you back out without sending the message you lose a point.</Text>
        <Text style={styles.instructionText}>3. If you get 10 points you win! If you get 0 points you lose!</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  title: {
    height: 80,
    width: '100%',
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    top: 0,
  },
  instructions: {
    height: 200,
    width: '100%',
    backgroundColor: '#00BFFF',
    position: 'absolute',
    bottom: 0,
  },
  instructionText: {
    fontSize: 18,
    color: 'black',
    margin: 10,
    color: 'white',
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  contact: {
    marginBottom: 20,
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  contactPhone: {
    fontSize: 16,
  },
  noContact: {
    fontSize: 18,
    marginBottom: 20,
  },
  score: {
    marginTop: 20,
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  gameOver: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 20,
  },
});