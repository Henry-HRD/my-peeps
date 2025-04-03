import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create an account',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" p={4}>
      <Box
        maxW="md"
        w="full"
        p={8}
        bg={cardBg}
        borderRadius="xl"
        boxShadow="xl"
        border="1px"
        borderColor={cardBorder}
      >
        <VStack spacing={6}>
          <Heading
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="bold"
          >
            Create Account
          </Heading>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  _focus={{ borderColor: 'blue.400' }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  _focus={{ borderColor: 'blue.400' }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  _focus={{ borderColor: 'blue.400' }}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading}
                _hover={{ transform: 'translateY(-2px)' }}
              >
                Sign Up
              </Button>
              <Text>
                Already have an account?{' '}
                <Button
                  variant="link"
                  colorScheme="blue"
                  onClick={() => navigate('/login')}
                  _hover={{ textDecoration: 'none', color: 'blue.500' }}
                >
                  Log In
                </Button>
              </Text>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
} 