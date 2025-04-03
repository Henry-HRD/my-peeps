import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { personService, Person } from '../services/personService';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  useToast,
  Input,
  Textarea,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';

export function Dashboard() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [newPerson, setNewPerson] = useState({ name: '', notes: '' });
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (currentUser) {
      loadPersons();
    }
  }, [currentUser]);

  async function loadPersons() {
    try {
      const data = await personService.getPersons(currentUser!.uid);
      setPersons(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load persons',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleAddPerson(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await personService.addPerson({
        ...newPerson,
        userId: currentUser.uid,
      });
      setNewPerson({ name: '', notes: '' });
      onClose();
      loadPersons();
      toast({
        title: 'Success',
        description: 'Person added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add person',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleUpdatePerson(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPerson) return;

    try {
      await personService.updatePerson(editingPerson.id!, {
        name: editingPerson.name,
        notes: editingPerson.notes,
      });
      setEditingPerson(null);
      onClose();
      loadPersons();
      toast({
        title: 'Success',
        description: 'Person updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update person',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleDeletePerson(id: string) {
    try {
      await personService.deletePerson(id);
      loadPersons();
      toast({
        title: 'Success',
        description: 'Person deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete person',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <Flex
        direction="column"
        align="center"
        bg={cardBg}
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        border="1px"
        borderColor={cardBorder}
      >
        <HStack justify="space-between" mb={8} w="full">
          <Heading
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="bold"
          >
            My Peeps
          </Heading>
          <Button
            onClick={handleLogout}
            variant="outline"
            colorScheme="blue"
            _hover={{ bg: 'blue.50' }}
          >
            Logout
          </Button>
        </HStack>

        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          mb={6}
          onClick={() => {
            setNewPerson({ name: '', notes: '' });
            onOpen();
          }}
          _hover={{ transform: 'translateY(-2px)' }}
        >
          Add Person
        </Button>

        <VStack spacing={4} align="stretch" w="full">
          {persons.map((person) => (
            <Box
              key={person.id}
              p={6}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={cardBorder}
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                borderColor: 'blue.200',
              }}
            >
              <HStack justify="space-between">
                <Box>
                  <Heading size="md" color="blue.600">
                    {person.name}
                  </Heading>
                  <Text mt={2} color="gray.600">
                    {person.notes}
                  </Text>
                </Box>
                <HStack>
                  <IconButton
                    aria-label="Edit person"
                    icon={<EditIcon />}
                    onClick={() => {
                      setEditingPerson(person);
                      onOpen();
                    }}
                    colorScheme="blue"
                    variant="ghost"
                    _hover={{ bg: 'blue.50' }}
                  />
                  <IconButton
                    aria-label="Delete person"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeletePerson(person.id!)}
                    _hover={{ bg: 'red.50' }}
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader>
              {editingPerson ? 'Edit Person' : 'Add New Person'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={editingPerson ? handleUpdatePerson : handleAddPerson}>
                <VStack spacing={4}>
                  <Input
                    placeholder="Name"
                    value={editingPerson ? editingPerson.name : newPerson.name}
                    onChange={(e) =>
                      editingPerson
                        ? setEditingPerson({ ...editingPerson, name: e.target.value })
                        : setNewPerson({ ...newPerson, name: e.target.value })
                    }
                    _focus={{ borderColor: 'blue.400' }}
                  />
                  <Textarea
                    placeholder="Notes"
                    value={editingPerson ? editingPerson.notes : newPerson.notes}
                    onChange={(e) =>
                      editingPerson
                        ? setEditingPerson({ ...editingPerson, notes: e.target.value })
                        : setNewPerson({ ...newPerson, notes: e.target.value })
                    }
                    _focus={{ borderColor: 'blue.400' }}
                  />
                  <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    _hover={{ transform: 'translateY(-2px)' }}
                  >
                    {editingPerson ? 'Update' : 'Add'}
                  </Button>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Container>
  );
} 