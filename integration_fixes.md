# Integration Issues Analysis and Fixes

## 🔍 **Issue 1: 403 Forbidden on PATCH /api/v1/psychologist/complaints/{id}/resolve**

### **Root Cause Analysis**
The PsychologistController has:
- ✅ Class-level `@PreAuthorize("hasRole('PSYCHOLOGIST')")` - CORRECT
- ✅ Method `@PatchMapping("/complaints/{complaintId}/resolve")` - CORRECT  
- ✅ Service-level tenant validation: `complaint.getTenantId().equals(staff.getTenant().getId())` - CORRECT
- ⚠️ **Potential JWT Role Mismatch**: `JwtAuthenticationFilter` lines 77-81 compare JWT role with database role

### **JWT Role Validation Logic Issue**
```java
// In JwtAuthenticationFilter.java lines 77-81
if (!jwtRole.equalsIgnoreCase(userRole)) {
    System.out.println("DEBUG JWT: Role mismatch - JWT: " + jwtRole + ", User: " + userRole);
    filterChain.doFilter(request, response);
    return;
}
```

**Problem**: If JWT role and database role don't match exactly (case-sensitive), access is denied.

### **Debugging Steps**
1. **Check JWT token contents**: Use jwt.io debugger to verify role claim
2. **Check database role**: Verify user's actual role in database
3. **Check case sensitivity**: Ensure both roles use same case
4. **Add debug logging**: The filter already has debug prints for role mismatches

---

## 🔍 **Issue 2: Cyrillic Encoding Problem (Mojibake)**

### **Root Cause Analysis**
Cyrillic text displaying as `âóëèíã` instead of `буллинг` indicates:
- ⚠️ **Database connection** missing UTF-8 encoding
- ⚠️ **Response content-type** not explicitly set to UTF-8

### **Applied Fixes**
✅ **Database URL Encoding**: Added `?characterEncoding=UTF-8` parameter
```yaml
datasource:
  url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/qamcore?characterEncoding=UTF-8}
```

✅ **Jackson Response Encoding**: Added explicit UTF-8 configuration
```yaml
jackson:
  default-property-inclusion: non_null
http:
  encoding:
    charset: UTF-8
    enabled: true
    force: true
```

✅ **Existing UTF-8 Configuration**: Already present
```yaml
messages:
  encoding: 'UTF-8'
```

---

## 🎯 **Expected Results**

### **After Database Encoding Fix**
- Cyrillic text should store correctly in PostgreSQL as `буллинг`
- Backend should return proper UTF-8 encoded responses
- Frontend should display Cyrillic text correctly

### **After 403 Fix Investigation**
- Check JWT debugger for exact role format
- Verify psychologist user has correct role in database
- Review case sensitivity in role comparison
- Monitor debug logs for role mismatch messages

---

## 🧪 **Testing Commands**

### **Check JWT Token**
```javascript
// In browser console
localStorage.getItem('token')
// Copy token and decode at https://jwt.io/
```

### **Verify Database Role**
```sql
SELECT username, role FROM users WHERE username = 'psychologist-username';
```

### **Test Encoding**
```bash
# Check database encoding
docker exec -it db psql -U postgres -d qamcore -c "SELECT * FROM complaints LIMIT 1;"

# Check response headers
curl -H "Authorization: Bearer <token>" -i http://localhost:8080/api/v1/psychologist/complaints
```

---

## 📝 **Next Debug Steps**

1. **Restart backend** with new encoding configuration
2. **Test Cyrillic text input** through frontend forms
3. **Monitor JWT debug logs** for role validation issues
4. **Verify PATCH endpoint** access with psychologist token
5. **Check content-type headers** in browser dev tools

---

## 🔧 **Additional Recommendations**

### **For JWT Issues**
- Consider adding more descriptive debug logging
- Implement role normalization (both to uppercase)
- Add role claim validation in JWT generation

### **For Encoding Issues**  
- Verify frontend files are saved as UTF-8
- Check browser encoding settings
- Test with various Cyrillic characters

### **Security Improvements**
- Add method-level `@PreAuthorize` for critical endpoints
- Implement role hierarchy validation
- Add audit logging for authorization failures
