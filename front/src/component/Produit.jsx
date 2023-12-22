import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, ListGroup, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

export default function Produit() {
    const ls = localStorage;
    const { productId } = useParams(); // Utilisation de useParams directement
    const [product, setProduct] = useState(null);
    const [quantite, setQuantite] = useState(1);
    const [Panier, setPanier] = useState([]);

    // Récupérer un produit en fonction de son ID
    const RecupProductById = async (productId) => {
        try {
            const reponse = await fetch(`http://localhost:8000/produit/${productId}`);
            const data = await reponse.json();
            setProduct(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleQuantiteChange = (e) => {
        // Mettre à jour la quantité lorsqu'elle change
        setQuantite(parseInt(e.target.value, 10));
    };

    {/* Fonction pour ajouter au panier */ }
    const addToCart = () => {
        // Vérifier si le panier existe déjà dans le localStorage
        const cart = ls.getItem('panier') ? JSON.parse(ls.getItem('panier')) : [];
        // Vérifier si le produit est déjà dans le panier
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        if (existingProductIndex !== -1) {
            // Le produit est déjà dans le panier, mettre à jour la quantité
            cart[existingProductIndex].quantite = quantite;
        } else {
            // Le produit n'est pas encore dans le panier, l'ajouter
            const produitAjoute = {
                id: productId,
                quantite: quantite,
                nom: product?.nom,
                prix: product?.prix,
            };
            cart.push(produitAjoute);
        }
        // Mettre à jour le panier dans le localStorage
        ls.setItem('panier', JSON.stringify(cart));
        setPanier(cart); 
    };


    useEffect(() => {
        const cart = ls.getItem('panier') ? JSON.parse(ls.getItem('panier')) : [];
        setPanier(cart);
        RecupProductById(productId); // Utilisation de la valeur directe de useParams
    }, [productId]); // Assurez-vous de déclarer id comme une dépendance pour useEffect

    return (
        <Container fluid="">
            <Row>
                <Col xs={12} md={6} className='mb-2'>
                    <h1>Détails du produit</h1>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top"
                            src={process.env.PUBLIC_URL + `/images/produits/${productId}.png`}
                            alt={product?.nom}
                            fluid="true"
                        />
                        <Card.Body>
                            <Card.Title>{product?.nom}</Card.Title>
                            <Card.Text>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>Prix unitaire : {product?.prix} €</ListGroup.Item>
                                    <ListGroup.Item>Quantité disponible : {product?.quantite}</ListGroup.Item>
                                    <ListGroup.Item>Description : {product?.description}</ListGroup.Item>
                                </ListGroup>
                            </Card.Text>
                            <Form.Group controlId="quantite">
                                <Form.Label>Quantité :</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={quantite}
                                    onChange={handleQuantiteChange}
                                    className='mb-2'
                                >
                                    {[...Array(product?.quantite).keys()].map((num) => (
                                        <option key={num + 1} value={num + 1}>
                                            {num + 1}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Button onClick={() => addToCart()} variant="primary">
                                    Ajouter au panier
                                </Button>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <h1>Panier</h1>
                    {Panier.length > 0 ? (
                        <div>
                            <Card className='mb-2'>
                                <ListGroup>
                                    {Panier.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            Produit: {item.nom}, Quantité: {item.quantite}, Prix : {item.prix} €
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                            <Button as={Link} to={'/panier'}>
                                Voir le panier
                            </Button>
                        </div>
                    ) : (
                        <p>Votre panier est vide.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
}