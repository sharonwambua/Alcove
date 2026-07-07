const { auth, db } = require('../config/firebase');
const { resolveTenantDoc } = require('./tenantController');


const tenantLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Tenant ID/email and password are required.' });
    }

    let tenantDoc = await resolveTenantDoc(identifier.trim());

    if (!tenantDoc) {
      const emailQuery = await db.collection('tenants').where('email', '==', identifier.trim().toLowerCase()).limit(1).get();
      if (!emailQuery.empty) tenantDoc = emailQuery.docs[0];
    }

    if (!tenantDoc) {
      return res.status(401).json({ success: false, message: 'No tenant account matches that ID or email.' });
    }

    const tenantData = tenantDoc.data();
    if (tenantData.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const { password: _omit, ...safeTenantData } = tenantData;

    return res.status(200).json({
      success: true,
      user: {
        id: tenantDoc.id,
        tenantDocId: tenantDoc.id,
        role: 'tenant',
        isPasswordChanged: tenantData.isPasswordChanged || false,
        ...safeTenantData
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided.' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    
    const { uid, email, name, picture } = decodedToken;
    const requestedRole = req.body.role || 'tenant';

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();


    if (requestedRole === 'tenant') {
      

      const tenantQuery = await db.collection('tenants').where('email', '==', email.toLowerCase().trim()).limit(1).get();
      if (tenantQuery.empty) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access Denied. Your landlord has not whitelisted this email address under a lease yet.' 
        });
      }

      const preRegisteredDoc = tenantQuery.docs[0];
      const preRegisteredData = preRegisteredDoc.data();

      if (userDoc.exists && userDoc.data().role === 'tenant') {
        const existingUser = userDoc.data();
        
        return res.status(200).json({ 
          success: true, 
          user: {
            ...existingUser,

            isPasswordChanged: preRegisteredData.isPasswordChanged || false,
            tenantDocId: preRegisteredDoc.id 
          }
        });
      }

      const newTenantProfile = {
        uid,
        email: email.toLowerCase().trim(),
        displayName: name,
        photoURL: picture,
        role: 'tenant',
        tenantId: preRegisteredData.tenantId,
        createdAt: new Date().toISOString()
      };

      await userRef.set(newTenantProfile);
      
      return res.status(200).json({ 
        success: true, 
        user: {
          ...newTenantProfile,
          isPasswordChanged: preRegisteredData.isPasswordChanged || false,
          tenantDocId: preRegisteredDoc.id
        } 
      });
    }


    
    let userData = { uid, email, displayName: name, photoURL: picture, role: 'landlord' };
    if (!userDoc.exists) {
      await userRef.set({ ...userData, createdAt: new Date().toISOString() });
    } else {
      userData = userDoc.data();
    }

    return res.status(200).json({ success: true, user: userData });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  loginUser,
  tenantLogin
};