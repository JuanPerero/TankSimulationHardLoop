import numpy as np
from scipy.integrate import solve_ivp

class WaterTank:
    """
    Clase simplificada que modela un tanque de agua con opciones para comportamiento lineal y no lineal.
    
    Parámetros:
    -----------
    A : float
        Área de la sección transversal del tanque [m²]
    a : float
        Área del orificio de salida [m²]
    g : float, opcional
        Aceleración de la gravedad [m/s²], por defecto 9.81
    h0 : float, opcional
        Nivel inicial de agua en el tanque [m], por defecto 0.0
    linear : bool, opcional
        Si es True, utiliza un modelo linealizado. Por defecto es False.
    K : float, opcional
        Constante del modelo lineal. Si se proporciona, se usa este valor.
        Si no, se calcula a partir de h0, a, A y g.
    tau : float, opcional
        Constante de tiempo para el modelo lineal. Si se proporciona, se usa este valor.
        Si no, se calcula a partir de h0, a, A y g.
    """
    
    def __init__(self, A, C, reference, dt=1, h0=0.0):
        self.A = A          # Área de la sección transversal del tanque [m²]
        self.g = 9.81       # Aceleración de la gravedad [m/s²]
        self.h = h0         # Nivel inicial del agua [m]
        self.C = C          # Coeficiente de descarga (k_2*a_2)
        self.dt= dt        # Intervalo de tiempo [s]
        self.h0 = h0       # Nivel inicial del agua [m]
        self.ref = reference

        self.g2 = -self.C*np.sqrt(2*self.g)

        C_2 = self.g2/(2*np.sqrt(self.h0))
        C_3 = self.g2*(np.sqrt(self.h0)-0.5*self.h0/np.sqrt(self.h0))
        self.Hp0 = C_2 * self.h0 + C_3
        self.Hp = self.Hp0

    def step(self, input):
        C_2 = self.g2/(2*np.sqrt(self.h0))
        C_3 = self.g2*(np.sqrt(self.h0)-0.5*self.h0/np.sqrt(self.h0))

        D_4 = self.dt *C_2/self.A
        self.Hp = (D_4 * input + self.Hp0)/(1 - D_4)

        self.h = (self.Hp - C_3)/C_2

        self.Hp0 = self.Hp
        self.h0 = self.h
        return self.h

    def set_values(self, A, C, reference, h0):
        # Actualizacion de los parametros del tanque
        self.A = A
        self.C = C
        self.ref = reference
        self.h0 = h0

        self.g2 = -self.C*np.sqrt(2*self.g)
        return


    def step_v1(self, input):

        C_2 = self.g2/(2*np.sqrt(self.h0))
        C_3 = self.g2*(np.sqrt(self.h0)-0.5*self.h0/np.sqrt(self.h0))

        D_4 = self.dt *C_2/self.A
        
        self.Hp = (D_4 * input + self.Hp0)/(1 - D_4)

        self.h = (self.Hp - C_3)/C_2

        self.Hp0 = self.Hp
        self.h0 = self.Hp
        return self.h




    def step_v0(self, input):
        """
        input = Entrada de flujo al tanque.
        
        Retorna:
        --------
        h : float
            Nuevo nivel de agua en el tanque.
        """

        # control de entrada de agua negativo
        if input < 0:
            input = 0
        
        C2 = self.C * np.sqrt(2 * self.g)
        # Constante lado izquierdo  (H(t) * ctte)
        C_left = self.A / self.dt + C2/(2*np.sqrt(self.h0))

        # Constante lado derecho    (qe + ctte)
        C_right = -self.C*np.sqrt(2*self.g*self.h0)  +  C2*self.h0 / np.sqrt(2*self.h0)  +  self.A*self.h0/self.dt

        # Calcular nueva altura
        self.h = (input + C_right) / (C_left)

        self.h0 = self.h    
        
        if self.h <= 0:
            return 0.0  # No hay flujo si el nivel es cero o negativo
                
        return self.h