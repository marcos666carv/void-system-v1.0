'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import Link from 'next/link';
import {
  Waves,
  Sparkles,
  Zap,
  Gift,
  ArrowRight,
  ChevronLeft,
  Users,
  Crown
} from 'lucide-react';

interface Variation {
  id: string;
  name: string;
  price: number;
  sessions?: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number; // Base price
  category: string;
  variations?: Variation[];
  promoLabel?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?active=true&limit=100');
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'floatation': return <Waves size={24} />;
      case 'massage': return <Sparkles size={24} />;
      case 'combo': return <Zap size={24} />;
      case 'gift_card': return <Gift size={24} />;
      default: return <Zap size={24} />;
    }
  };

  const categories = [
    { id: 'floatation', title: 'flutuação', description: 'isolamento sensorial profundo.', icon: <Waves size={24} /> },
    { id: 'massage', title: 'massagem', description: 'equilíbrio muscular e mental.', icon: <Sparkles size={24} /> },
    { id: 'combo', title: 'combos', description: 'o reset total: flutuação + massagem.', icon: <Zap size={24} /> },
    { id: 'gift_card', title: 'vale presente', description: 'presenteie com uma experiência única.', icon: <Gift size={24} /> }
  ];

  // Filter products by selected category
  const selectedProducts = products.filter(p => p.category === selectedCategory);

  // Flatten variations for display, or show product itself if no variations
  const displayOptions = selectedProducts.flatMap(p => {
    if (p.variations && p.variations.length > 0) {
      return p.variations.map(v => ({
        id: v.id,
        title: v.name,
        price: v.price,
        originalProduct: p
      }));
    }
    return [{
      id: p.id,
      title: p.name,
      price: p.price,
      originalProduct: p
    }];
  }).sort((a, b) => a.price - b.price);

  const resetSelection = () => setSelectedCategory(null);

  if (showWaitlist) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Left Side: Form */}
          <div style={{
            width: '100%',
            maxWidth: 'none',
            flex: '1 1 50%',
            display: 'grid',
            gap: 'var(--space-6)',
            alignContent: 'center',
            padding: 'var(--space-7)',
            backgroundColor: 'white',
            minWidth: '400px'
          }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%', display: 'grid', gap: 'var(--space-5)' }}>
              <Button color="tertiary" size="sm" onClick={() => setShowWaitlist(false)} className="justify-start -ml-4">
                <ChevronLeft size={20} className="mr-2" /> Voltar
              </Button>
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>
                  Fila de Espera <br />
                  <span style={{ color: 'var(--primary)' }}>VOID Club</span>
                </h2>
                <p style={{ opacity: 0.6 }}>
                  Nossas vagas são limitadas para garantir a qualidade de cada sessão. Entre na fila para ser notificado.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <Input label="Nome Completo" placeholder="Ex: Daniel Maretta" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input label="Telefone" placeholder="(11) 99999-9999" />
                  <Input label="CPF" placeholder="000.000.000-00" />
                </div>
                <Input label="Email" placeholder="daniel@email.com" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input label="Cidade" placeholder="São Paulo" />
                  <Input label="Profissão" placeholder="Bio-hacker" />
                </div>
                <Button color="primary" size="lg" className="w-full" onClick={() => {
                  alert('Inscrição realizada com sucesso! Você será avisado.');
                  setShowWaitlist(false);
                }}>
                  SOLICITAR ACESSO
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Image & Benefits */}
          <div style={{
            flex: '1 1 50%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#0f172a',
            display: 'flex',
            minHeight: '400px'
          }}>
            <img
              src="/assets/images/void-club-hero.jpg"
              alt="Void Club Experience"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.8
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
            }} />
            <div style={{ position: 'absolute', bottom: 'var(--space-7)', left: 'var(--space-7)', right: 'var(--space-7)', color: 'white' }}>
              <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-2)', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
                    <Zap size={20} color="#60a5fa" />
                  </div>
                  <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Sincronia Bio-hacking</h4>
                    <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Protocolos otimizados para maximizar sua recuperação neural.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-2)', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
                    <Sparkles size={20} color="#c084fc" />
                  </div>
                  <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Protocolos Exclusivos</h4>
                    <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Acesso a horários e equipamentos premium do Void System.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-2)', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
                    <Waves size={20} color="#22d3ee" />
                  </div>
                  <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Recuperação Acelerada</h4>
                    <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>O reset total que seu corpo e mente precisam semanalmente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'var(--space-7)',
      padding: 'var(--space-7) var(--space-5)',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div className="subtleBg" />

      <section style={{
        textAlign: 'left',
        textTransform: 'lowercase',
        display: 'grid',
        gap: 'var(--space-5)'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          lineHeight: 1.1,
          color: 'var(--foreground)',
          letterSpacing: '-0.02em'
        }}>
          escolha o seu <span style={{ color: 'var(--primary)' }}>reset</span>.
        </h1>
        <p style={{
          fontSize: '1rem',
          maxWidth: '520px',
          opacity: 0.5,
          lineHeight: 1.6
        }}>
          selecione uma categoria abaixo para começar sua jornada de alta performance.
        </p>
      </section>

      {/* Main Flow Container */}
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        {!selectedCategory ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-5)'
          }}>
            {/* Row 1: Service Cards */}
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="cursor-pointer h-full"
              >
                <Card className="h-full hover:border-black/20 transition-colors flex flex-col justify-between p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="mb-4">{cat.icon}</div>
                    <CardTitle className="text-xl font-semibold mb-2">{cat.title}</CardTitle>
                    <CardDescription className="opacity-50 text-sm leading-relaxed">{cat.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-0 text-primary font-semibold text-sm flex items-center">
                    ver opções <ArrowRight size={16} className="ml-2" />
                  </CardFooter>
                </Card>
              </div>
            ))}

            {/* Void Club Card */}
            <div
              className="col-span-4 cursor-pointer h-full min-h-[260px]"
              onClick={() => setShowWaitlist(true)}
            >
              <Card className="h-full overflow-hidden bg-[#08283B] border-white/10 glow p-0 rounded-xl">
                <div className="flex h-full flex-wrap">
                  <div className="flex-[1_1_400px] p-8 grid gap-5 content-center">
                    <div className="flex items-center gap-2">
                      <Crown size={20} color="#CCB0F0" />
                      <span className="text-xs font-semibold lowercase tracking-widest text-[#CCB0F0]">exclusive access</span>
                    </div>
                    <div className="grid gap-4">
                      <h3 className="text-3xl font-semibold leading-tight text-white">void club</h3>
                      <p className="text-white/70 text-[0.925rem] max-w-[380px]">
                        assinatura mensal para bio-hackers que buscam consistência absoluta.
                      </p>
                    </div>
                    <Button color="primary" size="lg" className="w-fit lowercase font-semibold">entrar na fila</Button>
                  </div>
                  <div className="flex-[1_1_300px] relative min-h-[260px]">
                    <img
                      src="/assets/images/void-club-hero.jpg"
                      alt="void club"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-6)', textTransform: 'lowercase' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Button color="secondary" size="sm" onClick={resetSelection} className="lowercase">
                <ChevronLeft size={20} className="mr-2" /> voltar
              </Button>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {categories.find(c => c.id === selectedCategory)?.title}: <span style={{ opacity: 0.5 }}>opções disponíveis</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-5)' }}>
              {displayOptions.length > 0 ? displayOptions.map((opt, i) => (
                <Card key={i} className="flex items-center justify-between p-6 lowercase">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{opt.title}</h4>
                    <span className="text-base opacity-60">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opt.price)}
                    </span>
                  </div>
                  <Link href={opt.originalProduct.category === 'gift_card' ? '/checkout' : '/book'}>
                    <Button color="primary" size="md" className="lowercase font-semibold">
                      selecionar
                    </Button>
                  </Link>
                </Card>
              )) : (
                <div style={{ opacity: 0.5, fontStyle: 'italic' }}>nenhuma opção disponível no momento.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


